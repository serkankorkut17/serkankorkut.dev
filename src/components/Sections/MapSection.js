export default function MapSection() {
  return (
    <section className="flex justify-center py-16 px-8 md:px-40 bg-white">
      <div className="w-full h-[500px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12053.369121484178!2d29.124409!3d40.95208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cac689ab10c585%3A0x154f7aab1a0f4be0!2sAyd%C4%B1nevler%2C%2034854%20Maltepe%2F%C4%B0stanbul!5e0!3m2!1str!2str!4v1725128603156!5m2!1str!2str"
          width="100%"
          height="100%"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          className="border-0"
        ></iframe>
      </div>
    </section>
  );
}
