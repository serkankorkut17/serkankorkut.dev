"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import withAdminAuth from "@/components/Admin/withAdminAuth";
import EditMapForm from "./EditMapForm";

function EditMapPage() {
    const params = useParams();
    const [map, setMap] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMap = async () => {
            try {
                const response = await fetch(`/api/maps/${params.name}`);
                const data = await response.json();
                if (data.success) {
                    setMap(data.map);
                }
            } catch (error) {
                console.error('Error fetching map:', error);
            } finally {
                setLoading(false);
            }
        };

        if (params.name) {
            fetchMap();
        }
    }, [params.name]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!map) {
        return <div>Harita bulunamadı</div>;
    }

    return (
        <EditMapForm mapData={map} />
    );
}

export default withAdminAuth(EditMapPage);
