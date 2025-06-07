export default function getAuctionStatus(auction) {
  const now = new Date();
  const start = new Date(auction.startTime || auction.startDate);
  const end = new Date(auction.endTime || auction.endDate);

  if (now < start) return "Upcoming";
  if (now >= start && now < end) return "Live";
  return "Ended";
}
