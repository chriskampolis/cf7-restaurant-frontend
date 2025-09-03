const Footer = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <>
      <footer className="bg-gray-600 text-white">
        <div className="container mx-auto py-8 text-center">
          &copy; {currentYear} Restaurant App - All rights reserved.
        </div>
      </footer>
    </>
  );
};

export default Footer;