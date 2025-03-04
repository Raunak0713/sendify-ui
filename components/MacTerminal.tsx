export default function MacTerminal() {
  return (
    <div className="flex justify-center items-center p-4 w-full">
      <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl border border-gray-800">
        {/* Terminal header */}
        <div className="bg-gray-800 px-4 py-2 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="mx-auto text-gray-400 text-sm font-medium mr-[147px] md:mr-[170px]">Installation</div>
        </div>

        {/* Terminal content */}
        <div className="bg-zinc-900 p-4 font-mono text-sm text-gray-200 min-h-[50px]">
          <div className="flex text-center justify-center">
            {/* <span className="text-green-400">user@macbook</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span> */}
            <span className="ml-1 md:text-lg">npm i sendify</span>
          </div>
          {/* <div className="mt-2">
            <div className="text-gray-300">
              <span className="text-yellow-400">added</span> 42 packages, and audited 43 packages in 2s
            </div>
            <div className="text-gray-300 mt-1">
              <span className="text-green-400">found</span> 0 vulnerabilities
            </div>
          </div>
          <div className="mt-2 flex">
            <span className="text-green-400">user@macbook</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$ </span>
            <span className="ml-1 animate-pulse">▌</span>
          </div> */}
        </div>
      </div>
    </div>
  )
}

