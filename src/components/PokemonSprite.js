import NextImage from 'next/legacy/image';

export default function PokemonSprite({ name = '', spriteUrl = '', idx }) {
  return (
    <a
      target='_blank'
      rel='noopener noreferrer'
      href={spriteUrl}
      className='h-80 block border border-gray-200 shadow-lg rounded-md bg-white hover:border-2 hover:border-blue-500  hover:shadow-blue-100 transition-all delay-75 duration-75 hover:scale-105 focus:outline-blue-500 overflow-hidden'
    >
      <h4 className='text-xl font-medium px-5 pt-5'>{name}</h4>
      <div className='h-full flex justify-center py-10'>
        <div>
          <NextImage
            priority={idx >= 0 && idx < 20}
            alt={name}
            src={`https://img.pokemondb.net/artwork/avif/${name}.avif`}
            width={112}
            height={112}
          />
        </div>
      </div>
    </a>
  );
}
