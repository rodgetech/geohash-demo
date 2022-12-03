import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Map from "../components/Map";
import { useCurrentLocation } from "../hooks/useCurrenLocation";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { location } = useCurrentLocation();

  const { data: nearByListings, isLoading: nearByIsLoading } =
    trpc.search.nearBy.useQuery(location!, { enabled: !!location });

  const { data: listings } = trpc.listings.getAll.useQuery();

  return (
    <div className="">
      {nearByIsLoading && <p>Loading nearby businesses...</p>}

      {nearByListings && (
        <div className="flex ">
          <div className="mt-32 flex flex-1  overflow-y-scroll">
            <ul className="grid grid-cols-3 gap-10 p-5">
              {nearByListings.map((listing) => (
                <li className="rounded-md border bg-white p-3" key={listing.id}>
                  <h3 className="text-xl">{listing.name}</h3>
                  <p className="mb-2 text-sm">{listing.address}</p>
                  <p className="text-slate-600">{listing.details}</p>
                </li>
              ))}
            </ul>
          </div>
          {location && (
            <div className="w-2/6 ">
              <div className="fixed right-0 top-20 h-full w-2/6 bg-white">
                <Map coords={location} listings={nearByListings} />
              </div>
            </div>
          )}
        </div>
      )}

      {!nearByIsLoading && !nearByListings && listings && (
        <ul className="grid grid-cols-3 gap-10">
          {listings.map((listing) => (
            <li className="rounded-md border bg-white p-3" key={listing.id}>
              <h3 className="text-xl text-blue-500">{listing.name}</h3>
              <p className="mb-2 text-sm">{listing.address}</p>
              <p className="text-slate-600">{listing.details}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
