export function sitemapToURLs(sitemapData: string) {
  const re = /<loc>(.*)<\/loc>/g;
  const data = [];

  let match = re.exec(sitemapData);
  while (match != null) {
    // matched text: match[0]
    // match start: match.index
    // capturing group n: match[n]
    data.push(match[1]);
    match = re.exec(sitemapData);
  }
  return data;
}
