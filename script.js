const repoList = document.querySelector("#repo-list");

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function createRepositoryItem(repository) {
  const item = document.createElement("li");
  item.className = "repo-item";

  const main = document.createElement("div");
  main.className = "repo-main";

  const link = document.createElement("a");
  link.className = "repo-link";
  link.href = repository.url;
  link.textContent = repository.repository;
  main.append(link);

  if (repository.description) {
    const description = document.createElement("p");
    description.className = "repo-description";
    description.textContent = repository.description;
    main.append(description);
  }

  if (repository.language) {
    const meta = document.createElement("div");
    meta.className = "repo-meta";
    meta.textContent = repository.language;
    main.append(meta);
  }

  const date = document.createElement("time");
  date.className = "repo-date";
  date.dateTime = repository.starred_at || "";
  date.textContent = `Starred ${formatDate(repository.starred_at)}`;

  item.append(main, date);
  return item;
}

async function loadRepositories() {
  try {
    const response = await fetch("./events.json");
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);

    const repositories = await response.json();
    if (!Array.isArray(repositories)) throw new Error("Repository data must be a list");

    repoList.replaceChildren();
    if (repositories.length === 0) {
      const emptyState = document.createElement("li");
      emptyState.className = "list-message";
      emptyState.textContent = "No starred repositories yet.";
      repoList.append(emptyState);
      return;
    }

    repositories.forEach((repository) => repoList.append(createRepositoryItem(repository)));
  } catch (error) {
    const errorState = document.createElement("li");
    errorState.className = "list-message";
    errorState.textContent = "Repositories could not be loaded. Please try again later.";
    repoList.replaceChildren(errorState);
    console.error("Could not load starred repositories:", error);
  } finally {
    repoList.setAttribute("aria-busy", "false");
  }
}

loadRepositories();