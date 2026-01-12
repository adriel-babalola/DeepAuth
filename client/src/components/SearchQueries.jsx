import { Search } from 'lucide-react'

const SearchQueries = ({ queries }) => {
   if (!queries || queries.length === 0) return null;

  return (
    <div className="serch-queries bg-gray-100 p-2 sm:p-3 rounded-xl flex flex-col gap-2 sm:gap-3 mx-3 sm:mx-5 mb-3">
      <h2 className='text-xs sm:text-sm flex items-center gap-2 shrink-0'>
        <Search className='size-3.5 shrink-0'/> Search Queries Used:
      </h2>
      <div className="queries flex flex-wrap gap-2 sm:gap-3">
        {queries.map((query, index) => (
          <p key={index} className='text-xs bg-white p-2 rounded-full whitespace-nowrap'>{query}</p>
        ))}
      </div>
    </div>
  );
}

export default SearchQueries
