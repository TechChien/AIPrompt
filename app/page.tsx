// Implement Search
// - Search by prompt
// - Search by tag
// - Search by username
// Implement Click on tag
// Implement View other porfiles

import HeaderTitle from "@/components/header-title";
import SearchBar from "@/components/searchBar";

export default function Home() {
  return (
    <div className="container">
      <HeaderTitle />
      <SearchBar />
    </div>
  );
}
