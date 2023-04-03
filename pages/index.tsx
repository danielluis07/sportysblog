import Head from "next/head";
import "slick-carousel/slick/slick.css";
import Banner from "../components/Banner";
import BannerBottom from "../components/BannerBottom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings";
import Image from "next/image";
import Link from "next/link";

interface Props {
  posts: [Post];
}

export default function Home({ posts }: Props) {
  return (
    <div>
      <Head>
        <title>Sportys | Um blog sobre esportes</title>
        <link rel="icon" href="/smallLogo.ico" />
      </Head>

      <main className="font-bodyFont">
        <Header posts={posts} />

        <Banner />

        <div className="max-w-7xl mx-auto h-60 relative">
          <BannerBottom />
        </div>
        {/* ============ Banner-Bottom End here ======= */}
        {/* ============ Post Part Start here ========= */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-6 px-4">
          {posts.map((post) => (
            <div
              key={post._id}
              className="border-[1px] border-secondaryColor border-opacity-40 h-[650px] group">
              <div className="h-3/5 w-full overflow-hidden">
                <Image
                  width={380}
                  height={350}
                  src={urlFor(post.mainImage).url()!}
                  alt="imagem"
                  loading="lazy"
                  className="w-full h-full object-cover brightness-75 group-hover:brightness-100 duration-300 group-hover:scale-100"
                />
              </div>
              <div className="h-2/5 w-full flex flex-col justify-center pb-5">
                <div className="block items-center px-4 pt-4 pb-4 border-b-[1px] border-b-gray-500 gap-5">
                  <p className="font-titleFont text-xl uppercase font-bold">
                    {post.title}
                  </p>
                  <div className="hidden sm:flex items-center gap-2 pt-3">
                    <p className="text-gray-400 text-xs">por</p>
                    <span className="font-semibold text-gray-500 text-xs">
                      {post.author.name}
                    </span>
                    <img
                      className="flex w-5 h-5 rounded-full object-cover"
                      src={urlFor(post.author.image).url()!}
                      alt="autor"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <p className="py-2 px-4 text-base">
                    {post.description.substring(0, 60)}...
                  </p>
                  <div className="flex justify-center">
                    <Link key={post._id} href={`/post/${post.slug.current}`}>
                      <button className="uppercase text-sm border-[1px] border-primaryColor hover:border-secondaryColor px-4 py-1 font-semibold hover:text-white rounded-md hover:bg-secondaryColor transition-all duration-300 active:bg-yellow-600">
                        CONTINUE LENDO
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* ============ Post Part End here =========== */}
        {/* ============ Footer Start here============= */}
        <Footer />
        {/* ============ Footer End here ============== */}
      </main>
    </div>
  );
}

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
