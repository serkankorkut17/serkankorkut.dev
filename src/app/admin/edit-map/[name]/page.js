import { connectToDatabase } from "@/utils/database";
import Map from "@/models/Map";
import EditMapForm from "./EditMapForm";

export default async function EditMapPage({ params }) {
    const { name } = await params;
    await connectToDatabase();
    const map = await Map.findOne({ name });

    if (!map) {
        return <div>Harita bulunamadı</div>;
    }

    const mapData = {
        name: map.name || "No Name",
        title: map.title || "No Title",
        active: map.active || false,
        image: map.image || "No Image",
        description: map.description || "No Description",
    };

    return <EditMapForm map={mapData} />;
}
