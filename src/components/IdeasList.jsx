import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
console.log("🚀 Production using absolute API URL:", API_URL);

const API_URL = "https://suitmedia-backend.suitdev.com/api/ideas";

function IdeasList() {
  const [ideas, setIdeas] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const page = parseInt(searchParams.get("page") || 1);
  const size = parseInt(searchParams.get("size") || 10);
  const sort = searchParams.get("sort") || "-published_at";

  useEffect(() => {
    fetchIdeas();
  }, [page, size, sort]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: {
          "page[number]": page,
          "page[size]": size,
          append: ["small_image", "medium_image"],
          sort: sort,
        },
      });

        console.log(response.data.data[0]);

        setIdeas(response.data.data);
        setTotal(response.data.meta.total);
    } catch (error) {
      console.error("Error fetching ideas", error);
    }
    setLoading(false);
  };

  const handleSortChange = (e) => {
    setSearchParams({ page: 1, size, sort: e.target.value });
  };

  const handleSizeChange = (e) => {
    setSearchParams({ page: 1, size: e.target.value, sort });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage, size, sort });
  };

    const totalPages = Math.ceil(total / size);

    const fallback = "https://via.placeholder.com/400x300?text=No+Image";

    const getThumbnail = (idea) => {
        const mediumImg = idea.medium_image?.[0]?.url;
        const smallImg = idea.small_image?.[0]?.url;
        const rawUrl =  mediumImg || smallImg;

    return rawUrl ? rawUrl : fallback;
    };


  return (
    <section className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <p className="text-sm text-gray-600">
          Showing {size * (page - 1) + 1} -{" "}
          {Math.min(size * page, total)} of {total}
        </p>

        <div className="flex gap-2">
          <select
            value={size}
            onChange={handleSizeChange}
            className="border p-2 rounded text-sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>

          <select
            value={sort}
            onChange={handleSortChange}
            className="border p-2 rounded text-sm"
          >
            <option value="-published_at">Newest</option>
            <option value="published_at">Oldest</option>
          </select>
        </div>
      </div>

      {/* Idea List */}
      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Link
              to={`/ideas/${idea.slug}`}
              key={idea.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
            <div className="relative h-[200px] bg-gray-100 bg-cover bg-center"
                style={{
                    backgroundImage: `url(${getThumbnail(idea)})`,
                }}
            ></div>

              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">
                  {new Date(idea.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2 className="text-lg font-bold line-clamp-3">
                  {idea.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-1 mt-10 flex-wrap">
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
            className="px-2 py-1 text-sm border rounded-md disabled:opacity-30"
          >
            «
          </button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 text-sm border rounded-md disabled:opacity-30"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((i) => {
              if (i === 1 || i === totalPages) return true;
              if (Math.abs(i - page) <= 1) return true;
              if (i === 2 && page <= 3) return true;
              if (i === totalPages - 1 && page >= totalPages - 2) return true;
              return false;
            })
            .map((i, idx, arr) => {
              const prev = arr[idx - 1];
              return (
                <span key={i}>
                  {prev && i - prev > 1 ? (
                    <span className="px-1 text-gray-400">...</span>
                  ) : null}
                  <button
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      page === i
                        ? "bg-orange-500 text-white"
                        : "hover:bg-orange-100 text-gray-700"
                    }`}
                  >
                    {i}
                  </button>
                </span>
              );
            })}

          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 text-sm border rounded-md disabled:opacity-30"
          >
            ›
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 text-sm border rounded-md disabled:opacity-30"
          >
            ››
          </button>
        </div>
      )}
    </section>
  );
}

export default IdeasList;
