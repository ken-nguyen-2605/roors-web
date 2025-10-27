//Homepage of the Restaurant Website//

import SlideBackground from "@/utils/SlideBackground";
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";
import CrewCard from "@/components/home/CrewCard";
import Image from "next/image";
import Link from "next/link";

import { Inria_Serif } from 'next/font/google';
const inriaSerif = Inria_Serif({
  weight: ['300'],
  subsets: ['latin'],
});

import { Italiana } from "next/font/google";
const italiana = Italiana({
  weight: ['400'],
  subsets: ['latin'],
});

const colors = [
  "#F5F4ED",
  "#FFFFFF",
  "#7A7A76",
  "#989793",
]
const dishes : Dish[] = [
  {id: 1, names: "Korean Bulgogi Plate", images: "/dishes/dish7.jpg", descriptions: "Tender, thinly sliced beef marinated in a savory-sweet Korean bulgogi sauce, grilled to perfection. .", ingredients: "Marinated beef slices, garlic, soy sauce, sesame oil, onions, lettuce wraps, and chili flakes."},
  {id: 2, names: "Crispy Shrimp Tacos", images: "/dishes/dish3.jpg", descriptions: "A vibrant fusion of spice and crunch — crispy shrimp tucked in warm tortillas with creamy chipotle aioli and a zesty slaw. Finished with a squeeze of fresh lime", ingredients: "Golden-fried shrimp, cabbage slaw, chipotle aioli, cilantro, lime wedges, and soft corn tortillas."},
  {id: 3, names: "Pan-Seared Sea Bass", images: "/dishes/dish12.jpg", descriptions: "Delicate and flavorful, our sea bass is pan-seared until golden and paired with a velvety butter-lemon reduction. Complemented by creamy mashed potato and a touch of red pepper coulis ", ingredients: "Fresh sea bass fillet, butter-lemon sauce, baby carrots, mashed potato, and red pepper coulis."},
  {id: 4, names: "Spicy Coconut Curry Noodles", images: "/dishes/dish8.jpg", descriptions: "A warm, aromatic bowl of noodles in a creamy coconut curry base — layered with bold spices, fresh shrimp, and a hint of sweetness. Topped with crispy wonton strips for texture", ingredients: "Egg noodles, coconut milk, chili paste, shrimp, crispy wonton strips, and lime leaves."},
]

export default function Home() {
  return (
    <section className="relative">

      <div className="absolute top-[1265px] w-full flex justify-center">
        <Image
          src="/background/Group 12.png"
          alt="Decorative shape"
          width={2000}
          height={2000}
          className="w-full h-[1429px]"
        />
      </div>

      <div className="absolute top-[2888px] w-full flex justify-center">
        <Image
          src="/background/Group 13.png"
          alt="Decorative shape"
          width={2000}
          height={2000}
          className="w-full h-[496px]"
        />
      </div>

      <SlideBackground
        images = {["/background/bg1.jpg", "/background/bg3.jpg", "/background/bg2.jpg"]}
        interval = {8000}
        transitionDuration = {1500}  
        className="flex-center h-screen w-full"
        overlay="bg-black/40 border-b-4 golden"  
      >
        <div className="flex-center w-[703px] h-[290px]">
          <span className="absolute top-0 left-0 w-[230px] h-[103px] border-white border-t-8 border-l-8"/>
          <span className="absolute bottom-0 right-0 w-[230px] h-[103px] border-white border-b-8 border-r-8"/>
          <div className="text-center text-white">
            <span className={`${inriaSerif.className} text-7xl`} style={{fontStyle: 'italic'}}>
              <p>This is a</p>
              <p>Restaurant</p>
            </span>
            <p className="text-2xl">since 2025...</p>
          </div>
        </div> 
      </SlideBackground>
      
      
      <section className="w-[1280px] h-[1114px] mt-[37px] mx-auto">
        <div className="relative flex flex-row gap-25 flex-center h-1/2"
        data-aos="fade-up"
        data-aos-delay="0" 
        data-aos-duration="650">
          <div className="">
            <span className={`${italiana.className} text-[40px] mb-2.5`}>Introduction</span>
            <div className="w-[585px] h-[255px] container-t-opened">
              <div className="p-4 text-xl">
                <p>
              At ROORS, we believe that food is more than a meal — it’s a story told through flavor, craft, and connection.
              Nestled in the heart of the city, ROORS was founded with a simple philosophy: to bring people closer through honest, handcrafted cuisine. Every dish we serve reflects a balance between tradition and innovation, blending the warmth of home-style cooking with the artistry of modern dining.                </p>
  
              </div>
            </div>
          </div>
          {/* <div className="flex-center"> */}
            <div className="relative flex w-[367px] h-[510px]">
              <Image
                src= "/image/home1.jpg"
                alt=""
                fill
                className="object-cover rounded-[183px] brightness-75"
              />
            {/* </div> */}
          </div>
        </div>
        <div className="relative flex flex-row gap-25 flex-center h-1/2"
        data-aos="fade-up"
        data-aos-delay="0" 
        data-aos-duration="650">
          <div className="relative flex w-[367px] h-[510px]">
            <Image
              src= "/image/home2.jpg"
              alt=""
              fill
              className="object-cover rounded-[20px] brightness-75"
            />
          </div>
          <div className="">
            <span className={`${italiana.className} flex justify-end text-[40px] mb-2.5`}>History</span>
            <div className="w-[585px] h-[255px] container-t-opened">
              <div className="p-4 text-xl">
                <p>
                  ROORS began as a small dream in 2015, when three lifelong friends — a chef, a traveler, and a designer — decided to build a place that felt like a breath of calm in a busy world.
                </p>
                <p>
                  The name “ROORS” was inspired by the sound of roots — a symbol of growth, grounding, and connection to the earth. From its earliest days, the restaurant has embraced that spirit: sourcing fresh, local ingredients and preparing each plate with integrity and heart.
                </p>
              </div>
            </div>
          </div>
        </div> 
      </section>

      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[66px] mx-auto">
        <Line color="black" size={514} direction="horizontal" thinkness={3}/>
        <Star color="black" size={64}/>
        <Line color="black" size={514} direction="horizontal" thinkness={3}/>
      </div>

      <section className="relative text-center flex flex-col gap-11 w-[1280px] h-auto mt-[75px] mx-auto">
        <span className={`${italiana.className} text-5xl`} 
        data-aos="fade-up"
        data-aos-delay="0" 
        data-aos-duration="650">Best Seller</span>
        {/* <div className="flex flex-col gap-2.5 mx-auto"> */}
          {dishes.map((dish, i) => (
            <div key={i} className="flex flex-row gap-2.5 dish-view-card mx-auto shadow-xl px-1 py-1.5" style={{ backgroundColor: colors[i]}}
            data-aos="fade-up"
            data-aos-delay={i*100} 
            data-aos-duration="650">
              <Image 
                src={dish.images}
                alt=""
                width={165}
                height={110}
                className="dish-view-image"
              />
              <div className={`py-1 text-[15px] text-left ${i === 2 ? "text-white" : "text-black"}`}>
                <p className="font-medium" style={{ fontStyle: `italic` }}>{dish.names}</p>
                <p>Description: {dish.descriptions}</p>
                <p>Ingredients: {dish.ingredients}</p>
              </div>
            </div>
          ))}
        {/* </div> */}
        <div 
          data-aos="fade-up"  
          data-aos-delay="0" 
          data-aos-duration="650">    
          <Link href="/about/menu" className="view-menu-button">
            <div className="transition duration-300 hover:text-black">- View full menu -</div>
          </Link>
        </div>
      </section>

      <div className="relative flex items-center justify-between w-[1134px] h-[64px] mt-[66px] mx-auto">
        <Line color="black" size={514} direction="horizontal" thinkness={3}/>
        <Star color="black" size={64}/>
        <Line color="black" size={514} direction="horizontal" thinkness={3}/>
      </div>

      <section className="relative text-center flex flex-col gap-13 w-[1280px] h-[900px] mt-[75px] mx-auto">
        <span className={`${italiana.className} text-5xl`}
        data-aos="fade-up"
        data-aos-delay="0" 
        data-aos-duration="650">Crew</span>
        <div className="flex flex-row gap-[85px] mx-auto"
        data-aos="fade-up"
        data-aos-delay="0" 
        data-aos-duration="650">
          <CrewCard name="crew1" image="/image/crew.jpg" facebook="https://www.facebook.com/hunghao.chau"/>
          <CrewCard name="crew2" image="/image/crew.jpg" facebook="https://www.facebook.com/hunghao.chau"/>
          <CrewCard name="crew3" image="/image/crew.jpg"/>
        </div>
        <div className="flex flex-row gap-[85px] mx-auto"
        data-aos="fade-up"
        data-aos-delay="0" 
        data-aos-duration="650">
          <CrewCard name="crew4" image="/image/crew.jpg" facebook="https://www.facebook.com/hunghao.chau" tiktok="https://www.facebook.com/hunghao.chau"/>
          <CrewCard name="crew5" image="/image/crew.jpg"/>
        </div>
      </section>
      
      {/* <div className="mt-100"></div> */}

    </section>
  );
}

