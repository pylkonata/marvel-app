import { useState, useEffect,useRef } from 'react';
import PropTypes from 'prop-types';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

const CharList = (props) => {
	const [charList, setCharList]= useState([]);
	const [newItemLoading, setNewItemLoading]= useState(false);
	const [offset, setOffset]= useState(122);
	const [charEnded, setCharEnded]= useState(false);
	
	const { loading, error, getAllCharacters } = useMarvelService();
	
	useEffect(()=>{
		onRequest(offset, true);
	}, []);

	const onRequest = (offset, initial)=> {
		initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
  };

  const onCharListLoaded = (newCharList) => {
		let ended = false;
		if(newCharList.length < 9){
			ended = true;
		}
		setCharList((prev)=>[...prev, ...newCharList]);
		setNewItemLoading(false);
		setOffset(prev=> prev + 9);
		setCharEnded(ended);
  }
    
	const myRef = useRef(null);

	const setStyle = (elem)=> {
		
		if(myRef.current===elem) return;
		if(myRef.current) myRef.current.classList.remove('char__item_selected');
		myRef.current=elem;
		elem.classList.add('char__item_selected');
		elem.focus();
	}

	const onCharSelected = (id, e)=>{
		props.onCharSelected(id);
		setStyle(e.currentTarget);
	}
  	
	const errorMessage = error? <ErrorMessage /> : null;
	const spinner = loading && !newItemLoading ? <Spinner /> : null;
	
	const charListItems = charList.map((char,i) => {
		return (
			<CharItem 
				char={char}
				key={char.id}
				index={i}
				onCharSelected={onCharSelected}
			/>
		)
	})

	return (
		<div className="char__list">
			{errorMessage}
			{spinner}
			<ul className="char__grid">					
				{charListItems}
			</ul>
			<button 
				className="button button__main button__long" 
				onClick={()=>onRequest(offset)}
				disabled={newItemLoading}
				style={{'display': charEnded ? 'none' : 'block'}}
			>
				<div className="inner">load more</div>
			</button>
		</div>
	)	
}

const CharItem = ({char, onCharSelected, index})=>{
	const {id, name, thumbnail} = char;
	const imgStyle = thumbnail?.includes('image_not_available')? {objectFit: 'contain'} : {objectFit: 'cover'};

	return (
		<li 
			className="char__item"
			onClick={(e)=>onCharSelected(id, e)}
			tabIndex={index}
			onKeyDown={(e) => {
				if (e.key  === 'Tab' || e.key  === 'Enter') {
					onCharSelected(id, e);
				}
			}}
		>
			<img src={thumbnail} alt={name} style={imgStyle}/>
			<div className="char__name">{name}</div>
		</li>
	)
}

CharList.propTypes = {
	onCharSelected: PropTypes.func.isRequired
}

export default CharList;
