const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protectRoute = async (req, res, next) => {
	try {
		let token = null;

		// ✅ 1. Check cookie first
		if (req.cookies?.accessToken) {
			token = req.cookies.accessToken;
		}

		// ✅ 2. Fallback to Authorization header (Bearer token)
		if (!token && req.headers.authorization?.startsWith("Bearer ")) {
			token = req.headers.authorization.split(" ")[1];
		}

		// ❌ 3. If still no token
		if (!token) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		// ✅ 4. Decode token
		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
   req.user = { userId: decoded.userId }; 
		// ✅ 5. Find user (without password)
		// const user = await User.findById(decoded.userId).select("-password");
		// if (!user) {
		// 	return res.status(401).json({ message: "Unauthorized - User not found" });
		// }

		// req.user = user;
		next();
	} catch (error) {
		console.error("Error in protectRoute middleware:", error.message);

		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Unauthorized - Token expired" });
		}

		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

const adminRoute = (req, res, next) => {
	if (req.user?.role === "admin") {
		next();
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};

module.exports = {
	protectRoute,
	adminRoute,
};
