export default function LogoCard({ svg }: { svg: string }) {
  return (
    <div
      className="border rounded-xl p-4 bg-white hover:shadow-lg transition"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
