import PokemonSprite from '@/components/PokemonSprite';

export default function PokemonSpritesList({pokemonSpecies = []}) {
  return (
    <div className='grid gap-x-6 gap-y-8 xs:grid-cols-2 lg:grid-cols-4'>
      {pokemonSpecies?.map(({name, url}, idx) => {
        return (
          <PokemonSprite
            idx={idx}
            key={name}
            name={name}
            spriteUrl={url}
          />
        );
      })}
    </div>
  );
}
