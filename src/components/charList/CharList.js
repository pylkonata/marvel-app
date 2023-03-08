import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import './charList.scss';

class CharList extends Component {
	state = {
		charList: [],
		loading: true,
    error: false,		
		newItemLoading: false,
		offset: 122,
		charEnded: false,
		charSelected: null,
	}

	marvelService = new MarvelService();

  componentDidMount(){
    this.onRequest();
  }

  onCharListLoaded = (newCharList) => {
		let ended = false;
		if(newCharList.length < 9){
			ended = true;
		}

    this.setState(({offset, charList}) => ({
      charList: [...charList, ...newCharList],
      loading: false,
      error: false,
			newItemLoading: false,
			offset: offset + 9,
			charEnded: ended,
    }));
  }
  
	onCharListLoading = () => {
		this.setState({
			newItemLoading: true,
		})
	}
  onError = () => {
    this.setState({
      loading: false,
      error: true
    })
  }
  onRequest = (offset)=> {
		this.onCharListLoading();
    this.marvelService
      .getAllCharacters(offset)
      .then(this.onCharListLoaded)
      .catch(this.onError)
  }

	setStyle = (elem)=> {
		this.setState(prev =>{
			if(prev.charSelected===elem) return;
			if(prev.charSelected) prev.charSelected.classList.remove('char__item_selected');
			return {
				charSelected: elem,
			}
		})
		elem.classList.add('char__item_selected');
		elem.focus();
	}

	onCharSelected = (id, e)=>{
		this.props.onCharSelected(id);
		this.setStyle(e.currentTarget);
	}

  render (){
		const {
			offset, charList, loading, error, newItemLoading, charEnded
		} = this.state;
    const errorMessage = error? <ErrorMessage /> : null;
    const spinner = loading? <Spinner /> : null;
		
		const charListItems = charList.map((char,i) => {
			return (
				<CharItem 
					char={char}
					key={char.id}
					index={i}
					onCharSelected={this.onCharSelected}
				/>
			)
		})
    const content = !(error || loading)? charListItems : null;

		return (
			<div className="char__list">
				{errorMessage}
				{spinner}
				<ul className="char__grid">					
					{content}
				</ul>
				<button 
					className="button button__main button__long" 
					onClick={()=>this.onRequest(offset)}
					disabled={newItemLoading}
					style={{'display': charEnded ? 'none' : 'block'}}
				>
					<div className="inner">load more</div>
				</button>
			</div>
	)
	}
}

const CharItem = ({char, onCharSelected, index})=>{
	const {id, name, thumbnail} = char;
	const imgStyle = thumbnail.includes('image_not_available')? {objectFit: 'contain'} : {objectFit: 'cover'};

	return (
		<li 
			className="char__item"
			onClick={(e)=>onCharSelected(id, e)}
			tabIndex={index}
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
