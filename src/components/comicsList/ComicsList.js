import { useState, useEffect} from 'react';

import './comicsList.scss';

import { Link } from 'react-router-dom';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

const ComicsList = () => {
    const [comicsList, setComicsList]= useState([]);
	const [newItemLoading, setNewItemLoading]= useState(false);
	const [offset, setOffset]= useState(220);
	const [comicsEnded, setComicsEnded]= useState(false);
	
	const { loading, error, getAllComics } = useMarvelService();
	
	useEffect(()=>{
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initial)=> {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllComics(offset)
      .then(onCharListLoaded)
  };

  const onCharListLoaded = (newComicsList) => {
		let ended = false;
		if(newComicsList.length < 8){
			ended = true;
		}
		setComicsList((prev)=>[...prev, ...newComicsList]);
		setNewItemLoading(false);
		setOffset(prev=> prev + 8);
		setComicsEnded(ended);
  }
  	
	const errorMessage = error? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;
	
	const charComicsItems = comicsList.map((comic,i) => {
		return (
			<ComicsItem 
				comic={comic}
				key={i}
				index={i}
			/>
		)
	})

  return (
    <div className="comics__list">
      {errorMessage}
      {spinner}
      <ul className="comics__grid">
        {charComicsItems}                
      </ul>
      <button
        className="button button__main button__long"
        onClick={()=>onRequest(offset)}
        disabled={newItemLoading}
        style={{ 'display': comicsEnded ? 'none' : 'block' }}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  )
}

const ComicsItem = ({comic})=>{
	const {id, title, thumbnail, price} = comic;

	return (
		<li className="comics__item">
			<Link to={`/comics/${id}`}>
				<img src={thumbnail} alt={title} className="comics__item-img"/>
        <div className="comics__item-name">{ title }</div>
				<div className="comics__item-price">{`${price}$`}</div>
			</Link>
		</li>
	)
}
export default ComicsList;
