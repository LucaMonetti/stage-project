import { Link } from "react-router-dom";

export type LinkProps = {
  label: string;
  url: string;
};

type Props = {
  topLinks: LinkProps[];
  bottomLinks?: LinkProps[];
};

const Sidebar = ({ topLinks }: Props) => {
  return (
    <aside className="min-w-64 p-8 h-[calc(100vh-64px)] flex flex-col justify-between border-transparent border-r-gray-700 border-2 fixed top-16">
      <ul className="flex flex-col gap-4">
        {topLinks.map((link, index) => (
          <li key={index}>
            <Link to={link.url}>{link.label}</Link>
          </li>
        ))}
      </ul>

      {/* {bottomLinks && (
        <ul className="flex flex-col gap-4">
          {bottomLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.url}>{link.label}</Link>
            </li>
          ))}
        </ul>
      )} */}
    </aside>
  );
};

export default Sidebar;
