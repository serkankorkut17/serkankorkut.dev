import { connectToDatabase } from '@/utils/database';
import { Template } from '@/models/Template';

export async function GET(req) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
  
    if (id) {
      const template = await Template.findById(id);
      return new Response(JSON.stringify(template), { status: 200 });
    } else {
      const templates = await Template.find();
      return new Response(JSON.stringify(templates), { status: 200 });
    }
  }
  
  export async function POST(req) {
    await connectToDatabase();
    const body = await req.json();
    const newTemplate = await Template.create(body);
    return new Response(JSON.stringify(newTemplate), { status: 201 });
  }
  
  export async function PUT(req) {
    await connectToDatabase();
    const body = await req.json();
    const { id, update } = body;
    await Template.findByIdAndUpdate(id, update);
    return new Response('Updated', { status: 200 });
  }
  
  export async function DELETE(req) {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Template.findByIdAndDelete(id);
    return new Response('Deleted', { status: 200 });
  }