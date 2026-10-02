import HomeView from "@/components/home/HomeView";
import { getHomepage } from "@/lib/api/server";

export default async function Home() {
  // Rendered on the server and cached under the 'cms' tag; the backend revalidates it on save.
  const homepage = await getHomepage().catch(() => null);
  return <HomeView initialHomepage={homepage} />;
}
