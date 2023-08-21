import { useHttp } from "../hooks/http.hook";

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=4289af79acfcc5766223eb35599ed13d';
  const _baseOffset = 210;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    
    return _transformCharacter(res.data.results[0]);
  };

  const getComic = async (comicId) => {
    const res = await request(`${_apiBase}comics/${comicId}?${_apiKey}`);
    
    return _transformComic(res.data.results[0]);
  }

  const getAllComics = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}comics?limit=8&offset=${offset}&issueNumber=0&${_apiKey}`
    );
    return res.data.results.map(_transformComic);
  };

  const _transformCharacter = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` :
        'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  };

  const _transformComic = (comic) => {
    return {
      id: comic.id,
      title: comic.title,
      thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
      price: comic?.prices[0]?.price ? comic?.prices[0]?.price : 'Not available',
			description: comic.description || "There is no description",
			pageCount: comic.pageCount
				? `${comic.pageCount} p.`
				: "No information about the number of pages",
			language: comic.textObjects[0]?.language || "en-us",
    }
  };

  return { loading, error, clearError, getAllCharacters, getCharacter, getAllComics, getComic };
}


export default useMarvelService;
