
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to SmartLoad</h1>
        <p className="text-xl text-gray-600 mb-8">Intelligent Energy Management</p>
        <div className="space-x-4">
          <Link 
            to="/dashboard" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
