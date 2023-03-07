import NextLink from '@/components/NextLink';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import useSwrInfinite from 'swr/infinite';
import { toast } from 'react-toastify';
import { useInView } from 'react-intersection-observer';
import { SWRConfig, unstable_serialize, useSWRConfig } from 'swr';
import fetchJsonData from '@/utils/fetchJsonData';
import PokemonSpritesList from '@/components/PokemonSpriteList';
import Spinner from '@/components/icons/Spinner';

const START_PAGE_IDX = 0;
const PAGE_ITEMS_LIMIT = 20;
const FALLBACK_KEY =
  'https://pokeapi.co/api/v2/pokemon-species/?offset=0&limit=20';

function getReqKey(pageIdx, prevPageData) {
  if (+pageIdx === 0 && !prevPageData) {
    return `https://pokeapi.co/api/v2/pokemon-species/?offset=${START_PAGE_IDX}&limit=${PAGE_ITEMS_LIMIT}`;
  }
  if (prevPageData && prevPageData?.next) {
    return `https://pokeapi.co/api/v2/pokemon-species/?offset=${
      pageIdx * 20
    }&limit=${PAGE_ITEMS_LIMIT}`;
  }
  //if there it is no the first request or the previousPage data has next as null
  return null;
}

function PokemonSpritesSection() {
  const { ref, entry, inView } = useInView({ rootMargin: '0px' });
  const { fallback } = useSWRConfig();
  //fetch the data infinite
  const { data, error, isLoading, isValidating, size, setSize } =
    useSwrInfinite(getReqKey, fetchJsonData, {
      onError: function (err) {
        toast.error(err.message, {
          toastId: 'fetch-error',
        });
      },
    });
  //states
  const [searchText, setSearchText] = useState('');
  const [deferredSearchText, setDeferredSearchText] = useState(searchText);
  //the state calculated from existing states
  //if results are undefined return []
  const fallbackData = fallback[FALLBACK_KEY]?.results ?? [];
  // the pokemon species data transformed and flatten to include just the results
  //since we are using SSR we going to provide the fallback data results here
  const pokemonSpecies = data
    ? data.flatMap(({ results }) => results)
    : fallbackData;

  //filter the pokemon based on the search text
  //if the search text is empty return the the whole list
  const pokemonSpeciesToShow =
    deferredSearchText && pokemonSpecies.length > 0
      ? pokemonSpecies.filter(({ name }) => {
          return name.startsWith(deferredSearchText);
        })
      : pokemonSpecies;
  /**
   * Check is the last element in the array has a next property
   *  to determine if there is more data to load
   */
  const hasMoreDataToLoad = Boolean(
    data?.length > 0 && data[data.length - 1]?.next
  );
  const isEmpty = pokemonSpecies.length === 0;
  const isLoadingMore =
    !error &&
    (isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined'));
  const availableSpeciesNo = data ? data[data.length - 1]?.count : 0;
  const loadSpeciesNo = pokemonSpecies.length;

  //effects
  useEffect(() => {
    //if the entry.isIntersecting is true there is
    if (inView && hasMoreDataToLoad) {
      setSize(size + 1);
    }
    //ignore other deps recommended by the this eslint rule
    //when size is added as a dependency it will cause infinite re-renders
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry]);

  useEffect(() => {
    let timerId = window.setTimeout(() => {
      setDeferredSearchText(searchText);
    }, 50);
    return () => {
      window.clearTimeout(timerId);
    };
  }, [searchText]);

  return (
    <section className='py-12'>
      <div>
        <label className='text-2xl tracking-tight font-semibold mb-1.5 block'>
          Search species
        </label>
        <input
          type='search'
          className='border block mb-10 py-2 rounded-md px-2 border-gray-400 focus:outline-offset-0 focus:outline-primary focus:border-primary focus-visible:outline-primary focus-visible:border-primary focus-visible:outline-offset-0'
          onChange={e => {
            setSearchText(e.target.value);
          }}
          value={searchText}
        />
      </div>
      {!isEmpty ? (
        <>
          <PokemonSpritesList pokemonSpecies={pokemonSpeciesToShow} />
          <div className='mt-6 ml-2'>
            <p className='text-xl'>
              Loaded <strong>{loadSpeciesNo}</strong> of{' '}
              <strong>{availableSpeciesNo}</strong> pokemon species
            </p>
          </div>
          {isLoadingMore && hasMoreDataToLoad ? (
            <div className='flex flex-col items-center justify-center font-medium gap-2 mt-6'>
              <Spinner className='text-primary h-8 w-8' />
              <p>Loading more...</p>
            </div>
          ) : null}
          {isValidating && !isLoadingMore ? (
            <div className='flex flex-col items-center justify-center font-medium gap-2 mt-6'>
              <Spinner className='text-primary h-8 w-8' /> <p>Validating...</p>
            </div>
          ) : null}
          <div className='flex justify-center items-center'>
            <button ref={ref} className='invisible'>
              Invisible
            </button>
          </div>
        </>
      ) : (
        <div className='py-10 text-center'>
          {' '}
          <h3 className='text-2xl font-medium text-red-500'>
            {' '}
            Ooops, There are no pokemon species to show
          </h3>
        </div>
      )}
    </section>
  );
}

export default function Home({ fallback }) {
  return (
    <SWRConfig value={{ fallback }}>
      <Head>
        <title>Next.js Infinite Loader using SWR</title>
        <meta name='description' content='Generated by create next app' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <nav className='max-w-screen-xl mx-auto px-6 py-10'>
        <ul className='flex justify-between'>
          <li>
            <NextLink className='font-mono text-2xl font-bold tracking-tight text-slate-800'>
              Infinite
            </NextLink>
          </li>
          <li>
            <NextLink
              href='#'
              className='bg-primary text-white py-3 px-6 rounded-md font-bold hover:bg-primary/95 focus-visible:outline-offset-2 focus-visible:outline-pink-300 focus:outline-pink-300 focus:outline-offset-2 drop-shadow-sm'
            >
              Go to
            </NextLink>
          </li>
        </ul>
      </nav>
      <main className='min-h-screen max-w-screen-xl mx-auto px-6'>
        <PokemonSpritesSection />
      </main>
    </SWRConfig>
  );
}

export async function getStaticProps() {
  try {
    const firstPageData = await fetchJsonData(
      `https://pokeapi.co/api/v2/pokemon-species/?offset=${START_PAGE_IDX}&limit=${PAGE_ITEMS_LIMIT}`
    );
    return {
      props: {
        fallback: {
          [unstable_serialize(FALLBACK_KEY)]: firstPageData,
        },
      },
    };
  } catch (err) {
    return {
      props: {
        fallback: {
          [unstable_serialize(FALLBACK_KEY)]: null,
        },
      },
    };
  }
}
