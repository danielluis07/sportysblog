import Image from "next/image";
import Link from "next/link";
import logoDark from "../public/images/logo.png";
import { useSession, signIn, signOut } from "next-auth/react";
import { AiOutlineSearch } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { useState } from "react";
import { Post } from "../typings";
import { sanityClient, urlFor } from "../sanity";
import { FaRegUserCircle } from "react-icons/fa";
import { AiOutlineMenu } from "react-icons/ai";

interface Props {
  posts: [Post];
}

const Header = ({ posts }: Props) => {
  const { data: session } = useSession();
  const [isSearchToggled, setIsSearchToggled] = useState(false);
  const [isMenuToggled, setIsMenuToggled] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="w-full h-20 border-b-[1px] border-b-black font-titleFont sticky top-0 bg-white z-50 px-4">
      <div className="max-w-7xl h-full mx-auto flex justify-between items-center">
        <Link href="/">
          <div>
            <Image width={80} height={80} src={logoDark} alt="logoDark" />
          </div>
        </Link>
        <div>
          <ul className="hidden sm:inline-flex gap-8 uppercase text-sm font-semibold">
            <li className="headerLi">
              <Link href="/">Início</Link>
            </li>
            <li className="headerLi">
              <Link href="/posts">Posts</Link>
            </li>
            <li className="headerLi">
              <Link href="/sobrenos">Sobre Nós</Link>
            </li>
          </ul>
        </div>
        <div className="flex items-center gap-8 text-lg">
          <div className="flex items-center gap-1">
            {session ? (
              <div className="flex items-center gap-3">
                <img
                  className="w-8 h-8 rounded-full"
                  src={session?.user!.image!}
                  alt="logo"
                />
                <p className="hidden sm:flex text-sm font-medium">
                  {session?.user!.name}
                </p>
              </div>
            ) : (
              <FaRegUserCircle className="h-8 w-8" onClick={() => signIn()} />
            )}
          </div>
          {session ? (
            <button
              onClick={() => signOut()}
              className="flex uppercase text-sm border-[1px] border-primaryColor hover:border-secondaryColor px-4 py-1 font-semibold hover:text-white rounded-md hover:bg-secondaryColor transition-all duration-300 active:bg-yellow-600">
              SAIR
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="hidden sm:flex uppercase text-sm border-[1px] border-primaryColor hover:border-secondaryColor px-4 py-1 font-semibold hover:text-white rounded-md hover:bg-secondaryColor transition-all duration-300 active:bg-yellow-600">
              ENTRAR
            </button>
          )}
          <AiOutlineSearch
            className="hidden sm:flex w-7 h-7 hover:animate-pulse cursor-pointer"
            onClick={() => setIsSearchToggled(!isSearchToggled)}
          />
          <AiOutlineMenu
            className="flex w-7 h-7 sm:hidden"
            onClick={() => setIsMenuToggled(!isMenuToggled)}
          />
          {isMenuToggled && (
            <div className="fixed right-0 bottom-0 h-full bg-white w-[300px]">
              <div className="flex justify-end p-12">
                <GrClose onClick={() => setIsMenuToggled(!isMenuToggled)} />
              </div>
              <div className="flex flex-col gap-10 ml-[33%] text-2xl text-deep-blue">
                <Link href="/">Início</Link>
                <Link href="/posts">Posts</Link>
                <Link href="/sobrenos">Sobre Nós</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {isSearchToggled && (
        <div className="block bg-white mx-auto w-[350] h-[500px] overflow-scroll sm:block my-10">
          <div className="flex justify-end p-8">
            <GrClose onClick={() => setIsSearchToggled(!isSearchToggled)} />
          </div>
          <input
            className="text-center block m-auto h-[80px] w-4/5 focus:outline-none"
            type="text"
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="block m-auto h-0.5 bg-black w-4/5"></div>
          <div className="flex flex-col gap-8 max-w-xl mx-auto my-10">
            {posts
              ?.filter((post) => post.title.toLocaleLowerCase().includes(query))
              .map((post) => (
                <div key={post._id}>
                  <Link href={`/post/${post.slug.current}`}>
                    <div className="border-[1px] border-secondaryColor border-opacity-40 h-[200px] group flex">
                      <div className="h-full w-1/4 overflow-hidden">
                        <Image
                          width={380}
                          height={350}
                          src={urlFor(post.mainImage).url()!}
                          alt="imagem"
                          loading="lazy"
                          className="w-full h-full object-cover brightness-75 group-hover:brightness-100 duration-300 group-hover:scale-100"
                        />
                      </div>
                      <div className="flex flex-col pl-3 w-full">
                        <div className="h-1/2 flex items-center">
                          <p className="font-bold">{post.title}</p>
                        </div>
                        <div className="h-1/2 border-t-2">
                          <p>{post.description.substring(0, 60)}...</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;

export const getServerSideProps = async () => {
  const query = `*[_type == "post"]{
      _id,
        title,
        author -> {
          name,
          image
        },
          description,
          mainImage,
          slug
    }`;
  const posts = await sanityClient.fetch(query);
  return {
    props: {
      posts,
    },
  };
};
