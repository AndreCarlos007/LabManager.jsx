import React from "react";

export default function LoginForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Coluna da Imagem */}
        <div className="md:w-1/2 bg-purple-600 flex items-center justify-center p-8">
          <div className="relative w-full h-64 md:h-full">
            
            
             <img 
              src="/image.png" 
              alt="Laboratório" 
              className="object-cover w-full h-full rounded-lg"
            /> 
          </div>
        </div>

        {/* Coluna do Formulário */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Welcome back! Please enter your details.</p>

          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Don’t have an account? <a href="#" className="text-purple-600 hover:underline">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}