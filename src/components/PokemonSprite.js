import Image from 'next/image';

const testSrc =
	'https://img.pokemondb.net/sprites/home/normal/2x/avif/umbreon.avif';

export default function PokemonSprite({
	name = 'dream-ball',
	imgSrc = testSrc,
	spriteLink = 'https://img.pokemondb.net/sprites/home/normal/2x/avif/umbreon.avif',
}) {
	return (
		<a
			target='_blank'
			rel='noopener noreferrer'
			href={spriteLink}
			className='h-64 block border border-gray-200 shadow-lg rounded-md bg-white hover:border-2 hover:border-blue-500  hover:shadow-blue-100 transition-all delay-75 duration-75 hover:scale-105'
		>
			<h4 className='text-2xl font-medium px-5 pt-5'>{name}</h4>
			<div className='mx-auto h-full flex justify-center py-10'>
				<div>
					<Image
						alt={name}
						src={imgSrc}
						width={100}
						height={100}
					/>
				</div>
			</div>
		</a>
	);
}
