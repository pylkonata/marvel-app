import { useState, useEffect } from 'react';
import useMarvelService from '../../services/MarvelService';
import PropTypes from 'prop-types';

import './charInfo.scss';

import Skeleton from '../skeleton/Skeleton';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const CharInfo = (props) => {
	const [char, setChar] = useState(null);

	const { loading, error, getCharacter, clearError } = useMarvelService();

	useEffect(() => {
    updateChar();
  },[props.charId]);

	const updateChar = () => {
		const {charId}=props;
		if(!charId){
			return;
		}
		
		clearError();
		getCharacter(charId)
			.then(onCharLoaded)
	};
	

	const onCharLoaded = (char) => {
    setChar(char);
  };
	
	const skeleton = !(char || error || loading)? <Skeleton/> : null;
	const errorMessage = error? <ErrorMessage /> : null;
	const spinner = loading? <Spinner /> : null;
	const content = !(error || loading || !char)? <View char={char}/> : null;

	return (
		<div className="char__info">
			{errorMessage}
			{spinner}
			{skeleton}
			{content}
		</div>
	)	
}

const View = ({char}) => {
	const{name, description, thumbnail, homepage, wiki, comics} = char;
	const imgStyle = thumbnail.includes('image_not_available')?
		{objectFit: 'contain'} : {objectFit: 'cover'};	

	return (
		<>
			<div className="char__basics">
				<img src={thumbnail} alt={name} style={imgStyle}/>
				<div>
					<div className="char__info-name">{name}</div>
					<div className="char__btns">
						<a href={homepage} className="button button__main">
							<div className="inner">homepage</div>
						</a>
						<a href={wiki} className="button button__secondary">
							<div className="inner">Wiki</div>
						</a>
					</div>
				</div>
			</div>
			<div className="char__descr">{description}</div>
			<div className="char__comics">Comics:</div>
			<ul className="char__comics-list">
				
				{comics.length > 0 ? null : 'There is no comics with this character'}
				{
					comics.map((item, i) => {
						// eslint-disable-next-line
						if (i > 9) return;
						return (
							<li key={i} className="char__comics-item">
								{item.name}
							</li>
						)
					})
				}				
			</ul>
		</>
	)
}

CharInfo.propTypes = {
	charId: PropTypes.number
}
export default CharInfo;
