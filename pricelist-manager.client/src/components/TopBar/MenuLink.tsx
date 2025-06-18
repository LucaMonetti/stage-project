import { Link } from "react-router";

type Props = { url: string; title: string }
function MenuLink({ url, title }: Props) {
  return (
	  <li>
		  <Link
			  className='tracking-wide relative after:absolute after:bg-white after:w-0 after:h-0.5 after:-bottom-1 after:left-0 hover:after:w-full after:transition-all '
			  to={url}>
			  {title}
		  </Link>
	  </li>
  );
}


export default MenuLink;