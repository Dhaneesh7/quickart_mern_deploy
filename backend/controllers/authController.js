const redis = require("../config/redis.js");
const User = require("../models/User.js");
const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	try{
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7 days
	} catch (error) {
		console.error("Error storing refresh token in Redis:", error.message);
		throw new Error("Failed to store refresh token");
	}	
};

const setCookies = (res, accessToken, refreshToken) => {
	const isProd = process.env.NODE_ENV === "production";
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		// secure: process.env.NODE_ENV === "production",
		// secure: process.env.NODE_ENV === "production",  
		secure: isProd,

		// secure: true, // For production, set to true
		// sameSite: "none",
		 sameSite: isProd ? "none" : "lax", // lax for dev
		// sameSite: "strict",
		maxAge: 15 * 60 * 1000,
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		// secure: process.env.NODE_ENV === "production",
		secure: isProd, // For production, set to true
		// secure: true, // For production, set to true
		// sameSite: "strict",
		// sameSite: "none",
		sameSite: isProd ? "none" : "lax", // ✅ important fix

		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

const signup = async (req, res) => {
	const { email, password, name ,role} = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ name, email, password ,role});

		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);
		setCookies(res, accessToken, refreshToken);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(401).json({ message: error.message });
	}
};

const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email }).select("+password");
console.log("User found in login:", user);
		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			console.log("Generated tokens:", { accessToken, refreshToken });
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(401).json({ message: error.message });
	}
};

const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(401).json({ message: "Server error", error: error.message });
	}
};

const refreshToken = async (req, res) => {
	try {
		const refreshTokenCookie = req.cookies.refreshToken;

		if (!refreshTokenCookie) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshTokenCookie, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshTokenCookie) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const newaccessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
const isProd = process.env.NODE_ENV === "production";

		res.cookie("accessToken", newaccessToken, {
			httpOnly: true,
			secure: isProd, // For production, set to true
			// secure: true, // For production, set to true
			// sameSite: "strict",
			// sameSite: "none",
			  sameSite: isProd ? "none" : "lax",
			maxAge: 15 * 60 * 1000,
		});
       res.json({ accessToken: newaccessToken });
		// res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(401).json({ message: "Server error", error: error.message });
	}
};
	const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
const getProfile = async (req, res) => {
		try {
		// const user = await User.findById(req.user.userId);

		// if (!user) {
		// 	return res.status(404).json({ message: "User not found" });
		// }

		// res.json(user);
		 if (!req.user ) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const user = await User.findById(req.user.userId).select("_id name email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
	} catch (error) {
		console.error("Profile fetch error:", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
	// 	try {
	// 	const user = await User.findById(req.user.userId).select("_id name email role");
	// 	if (!user) {
	// 		return res.status(404).json({ message: "User not found" });
	// 	}
	// 	res.json(user); // this will include _id
	// } catch (error) {
	// 	res.status(500).json({ message: "Server error", error: error.message });
	// }
	// try {
	// 	res.json(req.user);
	// } catch (error) {
	// 	res.status(500).json({ message: "Server error", error: error.message });
	// }
};

module.exports = {
	signup,
	login,
	logout,
	refreshToken,
	getProfile,
	getUserById,
};
