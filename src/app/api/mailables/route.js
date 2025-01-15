import { connectToDatabase } from "@/utils/database";
import { Mailable } from "@/models/Mailable";

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const newMailable = await Mailable.create(body);
    return new Response(JSON.stringify(newMailable), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  await connectToDatabase();
  console.log("heyeeeeee");

  try {
    console.log("heyeeeeee2");
    const mailables = await Mailable.find();
    return new Response(JSON.stringify(mailables), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function PATCH(req) {
  await connectToDatabase();
  const { id, ...updates } = await req.json();

  try {
    const updatedMailable = await Mailable.findByIdAndUpdate(id, updates, {
      new: true,
    });
    return new Response(JSON.stringify(updatedMailable), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  await connectToDatabase();
  const { id } = await req.json();

  try {
    await Mailable.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({ message: "Mailable deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
