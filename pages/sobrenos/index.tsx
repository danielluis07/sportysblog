import React from "react";
import Header from "../../components/Header";
import Image from "next/image";
import Footer from "../../components/Footer";
import aboutImg from "../../public/images/about.jpg";
import { Post } from "../../typings";
import { sanityClient } from "../../sanity";

interface Props {
  posts: [Post];
}

const aboutUs = ({ posts }: Props) => {
  return (
    <div>
      <Header posts={posts} />

      <Image className="w-full h-96 object-cover" src={aboutImg} alt="about" />

      <div className="max-w-3xl mx-auto mb-10 mt-10 flex flex-col gap-3">
        <h1 className="text-3xl mb-8">Etiam et integer massa aliquam</h1>
        <p>
          Turpis eu libero neque id fermentum praesent tortor parturient. Sit
          volutpat cursus nullam ridiculus quis egestas ligula. Accumsan cubilia
          libero ac si letius litora dignissim consequat mus fermentum vel.
          Mauris volutpat in risus praesent odio pulvinar.
        </p>
        <p>
          Tortor morbi orci platea tempus gravida dapibus proin augue laoreet
          nulla potenti. Dictum litora purus sodales enim si euismod habitant
          lacinia. Est potenti lectus vulputate natoque ornare nunc. Posuere nam
          hendrerit ante nisi urna cursus.
        </p>
        <p>
          Consequat lacinia ornare diam elit per arcu mattis non taciti
          ridiculus. Iaculis magna odio semper hendrerit placerat efficitur
          facilisi. Lorem dictum fames convallis molestie scelerisque dolor.
          Consequat metus libero ligula nisl arcu in letius risus vitae. Elit
          diam consequat feugiat potenti tristique tellus. Suscipit a non auctor
          bibendum parturient hac litora netus sagittis. Netus ut laoreet
          consequat vehicula cursus. Volutpat blandit augue ac mattis justo
          tellus. Class efficitur ante justo bibendum velit vivamus orci tempor
          consequat.
        </p>
        <p>
          Fames vitae sodales quisque fringilla enim. Eu lectus luctus
          parturient imperdiet etiam pulvinar habitasse. Nec at velit dui aenean
          sem netus ligula purus aptent suscipit morbi. Morbi consequat vel
          tincidunt maecenas platea aliquet. Leo habitasse primis ornare dis
          cras. Nunc amet diam semper in mi finibus. Tempor erat eleifend auctor
          neque suspendisse torquent. Maecenas ultrices etiam nisi at erat
          tempor. Fringilla nec consequat mauris id tortor. Lorem augue potenti
          donec turpis class ac lectus pellentesque leo. Hac ipsum scelerisque
          tempus adipiscing accumsan turpis luctus ac eros cursus. Est nam ante
          consectetur hac pharetra enim taciti eu sit. Molestie lobortis libero
          sem ante eleifend taciti.
        </p>
        Nulla proin lacinia mus duis. rutrum faucibus luctus.
        <p>
          Aliquam enim a sodales mi auctor vel. Cursus at montes id morbi
          finibus suscipit sem. Fermentum mollis amet viverra aenean feugiat.
          Aptent semper imperdiet sagittis dictum etiam aliquam taciti quam
          elementum dictumst lobortis. Dapibus gravida ipsum integer at id
          eleifend viverra tellus augue magnis. Dolor senectus in mus nunc
          aptent. Sit proin venenatis tristique rutrum nunc. Vel curae dignissim
          viverra maecenas volutpat massa ornare placerat per orci torquent.
          Venenatis bibendum maecenas senectus lacinia amet pharetra massa lacus
          elit nostra dictum.
        </p>
        <p>
          Eget cubilia purus phasellus suscipit congue. Sem consequat inceptos
          potenti ornare arcu aptent. Venenatis sem letius hac ipsum eros odio
          nostra massa mus consectetur. Hac aptent at pretium mollis gravida sem
          tempor efficitur. Nec a montes dui letius quis senectus natoque nulla
          egestas risus. Condimentum pretium id etiam netus nostra magnis
          molestie. Cras luctus habitant taciti nascetur eros nunc nec eget
          auctor ipsum. Mattis tempus magnis augue eleifend neque parturient
          congue arcu si. Fusce consectetuer rhoncus sociosqu mauris finibus
          mus.
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default aboutUs;

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
