import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="w-full h-full flex items-center justify-center flex-col gap-4">
      Home page
      <Link to="/login">Login</Link>
    </div>
  );
}

export default HomePage;
