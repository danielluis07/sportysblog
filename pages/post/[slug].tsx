import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import { GetStaticProps } from "next";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useSession } from "next-auth/react";
import "slick-carousel/slick/slick.css";

interface Props {
  post: Post;
}

interface Props {
  posts: [Post];
}

type Inputs = {
  _id: string;
  name: string;
  email: string;
  comment: string;
};

const Poste = ({ post, posts }: Props) => {
  const { data: session } = useSession();
  const [userErr, setUserErr] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        setSubmitted(true);
      })
      .catch((err) => {
        setSubmitted(false);
      });
  };

  const handleUserErr = () => {
    if (!session) {
      setUserErr("Por favor, entre em sua conta para comentar!");
    } else {
      setUserErr("");
    }
  };

  return (
    <div>
      <Header posts={posts} />
      <img
        className="w-full h-96 object-cover"
        src={urlFor(post.mainImage).url()!}
        alt="imagem-principal"
      />
      <div className="max-w-3xl mx-auto mb-10">
        <article className="w-full mx-auto p-5 bg-secondaryColor/10">
          <h1 className="font-titleFont font-medium text-[32px] text-primary border-b-[1px] border-b-cyan-800 mt-10 mb-3">
            {post.title}
          </h1>
          <h2 className="font-bodyFont text-[18px] text-gray-500 mb-2">
            {post.description}
          </h2>
          <div className="flex items-center gap-2">
            <img
              className="rounded-full w-8 h-8 object-cover bg-red-400"
              src={urlFor(post.author.image).url()}
              alt="autor"
            />
            <p className="font-bodyFont text-base text-gray-400">
              Por <span>{post.author.name}</span> - Publicado em{" "}
              {new Date(post.publishedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-10">
            <PortableText
              dataset={process.env.NEXT_PUBLIC_SANITY_DATASET || "production"}
              projectId={
                process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "kn1ighva"
              }
              content={post.body}
              serializers={{
                h1: (props: any) => (
                  <h1
                    className="text-3xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h2: (props: any) => (
                  <h2
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                h3: (props: any) => (
                  <h3
                    className="text-2xl font-bold my-5 font-titleFont"
                    {...props}
                  />
                ),
                li: ({ children }: any) => (
                  <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                  <a href={href} className="text-cyan-500 hover:underline">
                    {children}
                  </a>
                ),
              }}
            />
          </div>
        </article>
        <hr className="max-w-lg my-5 mx-auto border[1px] border-secondaryColor" />
        {submitted ? (
          <div className="flex flex-col items-center gap-2 p-10 my-10 bg-bgColor text-white mx-auto">
            <h1 className="text-2xl font-bold">Obrigado pelo comentário!</h1>
            <p>Se o mesmo for aprovado, irá aparecer abaixo</p>
          </div>
        ) : (
          <div>
            <p className="text-xs text-secondaryColor uppercase font-titleFont font-bold">
              Gostou desse post?
            </p>
            <h3 className="font-titleFont text-3xl font-bold">
              Deixe um comentário
            </h3>
            <hr className="py-3 mt-2" />
            {/* Gerando Id para o hooks form */}
            <input
              {...register("_id")}
              type="hidden"
              name="_id"
              value={post._id}
            />
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-7 flex flex-col gap-6">
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Nome
                </span>
                <input
                  {...register("name", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  type="text"
                  placeholder="Nome"
                />
                {errors.comment && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    Insira seu nome!
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Email
                </span>
                <input
                  {...register("email", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  type="email"
                  placeholder="Email"
                />
                {errors.comment && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    Insira seu email!
                  </p>
                )}
              </label>
              <label className="flex flex-col">
                <span className="font-titleFont font-semibold text-base">
                  Comentário
                </span>
                <textarea
                  {...register("comment", { required: true })}
                  className="text-base placeholder:text-sm border-b-[1px] border-secondaryColor py-1 px-4 outline-none focus-within:shadow-xl shadow-secondaryColor"
                  placeholder="Comentário"
                  rows={6}
                />
                {errors.comment && (
                  <p className="text-sm font-titleFont font-semibold text-red-500 my-1 px-4">
                    Insira seu comentário!
                  </p>
                )}
              </label>
              {session && (
                <button
                  className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                  type="submit">
                  ENVIAR
                </button>
              )}
            </form>
            {!session && (
              <button
                onClick={handleUserErr}
                className="w-full bg-bgColor text-white text-base font-titleFont font-semibold tracking-wider uppercase py-2 rounded-sm hover:bg-secondaryColor duration-300"
                type="submit">
                ENVIAR
              </button>
            )}
            {userErr && (
              <p className="text-sm font-titleFont text-center font-semibold text-red-500 underline underline-offset-2 my-1 px-4 animate-bounce">
                {userErr}
              </p>
            )}
            <div className="w-full flex flex-col p-10 my-10 mx-auto shadow-bgColor shadow-lg space-y-2">
              <h3 className="text-3xl font-titleFont font-semibold">
                Comentários
              </h3>
              <hr />
              {post.comments.map((comment) => (
                <div key={comment._id}>
                  <p>
                    <span className="text-secondaryColor">{comment.name}</span>{" "}
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Poste;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
          slug{
          current
          }
      }`;

  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current,
    },
  }));
  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
        _id,
          publishedAt,
          title,
          author ->{
            name,
            image,
          },
          "comments":*[_type == "comment" && post._ref == ^._id && approved == true],
          description,
          mainImage,
          slug,
          body
      }`;

  const post = await sanityClient.fetch(query, {
    slug: params?.slug,
  });

  if (!post) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      post,
    },
    revalidate: 60,
  };
};
