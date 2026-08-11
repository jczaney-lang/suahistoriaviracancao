import Header from "./components/Header";
import Hero from "./components/Hero";
import Diferenciais from "./components/Diferenciais";
import ComoFunciona from "./components/ComoFunciona";
import Demonstracao from "./components/Demonstracao";
import Formulario from "./components/Formulario";
import Depoimentos from "./components/Depoimentos";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Diferenciais />
      <ComoFunciona />
      <Demonstracao />
      <Formulario />
      <Depoimentos />
      <Footer />
    </>
  );
}