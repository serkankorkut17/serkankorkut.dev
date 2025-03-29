// app/page.js
import { cookies } from "next/headers";
import PasswordPromptDialog from "@/components/PasswordPromptDialog";
import { Button } from "flowbite-react";
import Link from "next/link";

const Page = (props) => {
    const cookiesStore = cookies();
    const loginCookies = cookiesStore.get(process.env.PASSWORD_COOKIE_NAME);
    const isLoggedIn = !!loginCookies?.value;

    if (!isLoggedIn) {
        return <PasswordPromptDialog />;
    } else {
        return (
            <section className="flex flex-col py-16 px-8 md:px-40 bg-white text-black min-h-screen">
                <div className="flex flex-col items-center justify-center space-y-4 mt-10">
                    <h1 className="text-2xl font-bold">Admin Panel</h1>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/admin/add-map">
                            <Button color="blue">Add Map</Button>
                        </Link>
                        <Link href="/admin/edit-map">
                            <Button color="green">Edit Map</Button>
                        </Link>
                        <Link href="/admin/add-nade">
                            <Button color="purple">Add Nade</Button>
                        </Link>
                        <Link href="/admin/edit-nade">
                            <Button color="red">Edit Nade</Button>
                        </Link>
                    </div>
                </div>
            </section>
        );
    }
};

export default Page;
