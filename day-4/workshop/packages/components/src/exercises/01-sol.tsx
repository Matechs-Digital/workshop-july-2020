import * as React from "react";

export interface Organization {
  login: string;
  id: number;
  node_id: string;
  url: string;
  repos_url: string;
  events_url: string;
  hooks_urs: string;
  issues_url: string;
  members_url: string;
  public_members_url: string;
  avatar_url?: string;
  description?: string;
}

export const Loading = () => <div>Loading...</div>;

export const ErrorMessage = ({ error }: { error: string }) => (
  <div>Error: {error}</div>
);

export const fetchOrganizations = async (
  since = 0
): Promise<Organization[]> => {
  const res = await fetch(
    `https://api.github.com/organizations?since=${since}`
  );
  return (await res.json()) as Organization[];
};

export interface FetchOrganizationsContext {
  fetchOrganizations: (since?: number) => Promise<Organization[]>;
}

export const fetchOrgsContext = React.createContext<FetchOrganizationsContext>({
  fetchOrganizations,
});

export interface Loading {
  _tag: "Loading";
}

export interface Errored {
  _tag: "Errored";
  error: string;
  retryPage: () => void;
}

export interface Done {
  _tag: "Done";
  organizations: Organization[];
  fetchNext: () => void;
}

export type OrganizationsState = Loading | Errored | Done;

export const useOrganizations = () => {
  const { fetchOrganizations } = React.useContext(fetchOrgsContext);

  const [orgState, setOrgState] = React.useState<OrganizationsState>({
    _tag: "Loading",
  });

  React.useEffect(() => {
    fetchNext(0);
  }, []);

  const fetchNext = (lastId: number) => {
    setOrgState({ _tag: "Loading" });
    fetchOrganizations(lastId)
      .then((orgs) => {
        setOrgState({
          _tag: "Done",
          organizations: orgs,
          fetchNext: () => {
            fetchNext(
              [0, ...orgs.map((o) => o.id)].reduce((x, y) => Math.max(x, y))
            );
          },
        });
      })
      .catch(() => {
        setOrgState({
          _tag: "Errored",
          error: "unexpected error",
          retryPage: () => {
            fetchNext(lastId);
          },
        });
      });
  };

  return orgState;
};

interface OrganizationContext {
  useOrganizations: () => OrganizationsState;
}

export const organizationContext = React.createContext<OrganizationContext>({
  useOrganizations,
});

export const Organizations = () => {
  const { useOrganizations } = React.useContext(organizationContext);
  const orgState = useOrganizations();

  switch (orgState._tag) {
    case "Loading":
      return <Loading />;

    case "Errored":
      return (
        <>
          <ErrorMessage error={orgState.error} />
          <div style={{ marginTop: "1em" }}>
            <button onClick={orgState.retryPage}>Retry</button>
          </div>
        </>
      );

    case "Done":
      return (
        <>
          <div style={{ marginBottom: "1em" }}>Organizations:</div>
          {orgState.organizations.map((o) => o.login).join(", ")}
          <div style={{ marginTop: "1em" }}>
            <button onClick={orgState.fetchNext}>Next</button>
          </div>
        </>
      );
  }
};
