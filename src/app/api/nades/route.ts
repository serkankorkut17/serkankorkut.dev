import { connectToDatabase } from "@/utils/database";
import Nade from "@/models/Nade";
import type { NadeFilters } from "@/types/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    await connectToDatabase();
    try {
        const url = new URL(request.url);
		const params = url.searchParams;

        const filters: NadeFilters = {};

        const search = params.get("search")?.trim();
		const type = params.get("type");
		const side = params.get("side");
		const map = params.get("map");
		const pageSize = parseInt(params.get("pageSize") || "0", 10);
		const pageNumber = parseInt(params.get("pageNumber") || "1", 10);

        if (search) {
            filters.$or = [
                { name: new RegExp(search, "i") },
            ];
        }

        if (type) {
            filters.type = type;
        }

        if (side) {
            filters.side = side;
        }

        if (map) {
            filters.map = map;
        }

        const total = await Nade.countDocuments(filters);

        let query = Nade.find(filters).sort({ name: 1 });
        if (pageSize) {
			const skip = ((pageNumber ?? 1) - 1) * pageSize;
			query = query.limit(pageSize).skip(skip);
		}

        const nades = await query.exec();

        const totalPages = pageSize ? Math.ceil(total / pageSize) : 1;

        return NextResponse.json(
            {
                data: nades,
                pageNumber: pageNumber,
                pageSize: pageSize,
                total,
                totalPages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET /api/nades error:", error);
        return NextResponse.json({ error: "Failed to fetch nades" }, { status: 500 });
    }
}

// export async function POST(request: Request) {
//     await connectToDatabase();
//     try {
//         const body = await request.json();
//         const nade = new Nade(body);
//         await nade.save();
//         return new Response(JSON.stringify(nade), { status: 201 });
//     } catch (error) {
//         return new Response(JSON.stringify({ error: error.message }), {
//             status: 400,
//         });
//     }
// }
