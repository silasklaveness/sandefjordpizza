import Link from "next/link";

import Header from "../components/layout/Header";
import Hero from "../components/layout/Hero";
import Homemeny from "../components/layout/HomeMeny";
import SectionHeaders from "@/components/layout/SectionHeaders";
export default function Home() {
  return (
    <>
      <Hero />
      <Homemeny />
      <section className="text-center my-16" id="about">
        <SectionHeaders subHeader={"Our Story"} mainHeader={"ABout us"} />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4">
          <p>
            Vi ønsker alle nye og eksisterende kunder velkommen til en herlig
            smaksopplevelse. Tønsberg Pizza har helt siden 90-tallet blitt
            omtalt som «byens beste pizza». Vi benytter ferske lokale råvarer og
            baker våre ferske pizzabunner hver dag.
          </p>
          <p>
            Vi ønsker deg velkommen inn i vår restaurant i sentrum av Tønsberg
            for en smaksopplevelse du sent vil glemme!
          </p>
          <p>
            Lorem dahdjahdj Lorem dahdjahdjLorem dahdjahdjLorem dahdjahdjLorem
            dahdjahdjLorem dahdjahdjLorem dahdjahdjLorem dahdjahdj Lorem
            dahdjahdjLorem dahdjahdjLorem dahdjahdj
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders subHeader={"Dont hesitate"} mainHeader={"Contact Us"} />
        <a
          className="text-4xl underline mt-8 text-gray-500"
          href="tel:+4745786703"
        >
          +47 45786703
        </a>
      </section>
    </>
  );
}
