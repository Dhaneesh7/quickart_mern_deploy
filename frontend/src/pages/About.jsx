const About = () => {
  return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-4">About us</h1>
//       <p className="mb-4">
//         QuickCart is a project, here’s a tailored "About Us" section emphasizing that it’s a learning/demo app—not a real business:
//       </p>
//       <h2 className="text-2xl font-semibold mb-2">About This Project</h2>
//       <p className="mb-4">
//         Welcome! QuickCart is a e‑commerce demo app crafted to showcase full-stack skills in frontend, backend, authentication, cart management, theming, and responsive design.
//       </p>
//       <h2 className="text-2xl font-semibold mb-2">Tech Stack Overview</h2>
//            <h5 className="text-2xl font-semibold mb-2">Frontend</h5>

//       <p className="mb-4">
    
// React - Core UI framework powering your components and pages.
// Tailwind CSS - Utility-first CSS framework for building responsive and themeable layouts (light/dark) with minimal overhead .


//       </p>
//                  <h5 className="text-2xl font-semibold mb-2">Frontend</h5>
//       <p className="mb-4">

// uses Node.js + Express for endpoints serving product, cart, and order data—based on patterns in similar MERN e‑commerce apps.
// Integrates JWT token generation/validation for authentication.
// </p>
//     </div>
 <div className="flex flex-col items-center px-4 py-12 min-h-screen bg-gray-900 text-gray-200">
    <div className="max-w-3xl space-y-8">
      <h1 className="text-4xl font-bold text-white text-center">About <span className="text-blue-500">Quic<span className="text-green-500">K</span>art</span></h1>

      <section className="space-y-4">
        <p className="text-lg">
          <span className="text-blue-500">Quic<span className="text-green-500">K</span>art</span>(QuickCart) is a <strong> e-commerce demo project</strong> featuring full-stack flows like authentication, product browsing, cart handling, and theming. It’s <em>not</em> a live store, but a showcase of your development skills.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-center border-b border-gray-700 pb-2">🚧 Project Purpose</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Demonstrate React routing, Zustand state, and theme toggling.</li>
          <li>Simulate e-commerce flows: signup, login, browse, cart, place order.</li>
          <li>Solid foundation to integrate real backend or payment later.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-center border-b border-gray-700 pb-2">🛠 Tech Stack</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>React </strong> – fast, modern frontend.</li>
          <li><strong>Tailwind CSS</strong> – responsive, themeable UI (<em>clear, organized layout aids scannability</em>).</li>
          <li><strong>Node.js + Express (backend)</strong> – simulating API endpoints with JWT auth.</li>
        </ul>
      </section>

      <section className="text-center space-y-4">
        <p className="italic">
          Built to <strong>learn</strong> and showcase modern web development. Extend it with a real backend, payment gateway, admin panel, or persistent sessions whenever you’re ready!
        </p>
      </section>
    </div>
  </div>
  );
}
export default About;