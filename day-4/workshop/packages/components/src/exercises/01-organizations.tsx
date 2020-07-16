import * as React from "react";
import * as H from "./fetchJson";

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

export interface IOrgCtx {
  fetchOrganizations: (since: number) => Promise<Organization[]>;
}

export const fetchOrganizations = async (since: number) => {
  return H.fetchJson<Organization[]>(
    `https://api.github.com/organizations?since=${since}`
  );
};

export const OrgCtx = React.createContext<IOrgCtx>({
  fetchOrganizations: fetchOrganizations,
});

export interface Loading {
  _tag: "Loading";
}

export interface Errored {
  _tag: "Errored";
  reason: string;
  retry: () => void;
}

export interface Done {
  _tag: "Done";
  orgs: Organization[];
  nextPage: () => void;
}

export type OrganizationsState = Loading | Errored | Done;

export function useOrganisation(): OrganizationsState {
  const { fetchOrganizations } = React.useContext(OrgCtx);

  const [state, setState] = React.useState<OrganizationsState>({
    _tag: "Loading",
  });

  React.useEffect(() => {
    fetchSince(0);
  }, []);

  const fetchSince = (lastId: number) => {
    setState({
      _tag: "Loading",
    });

    fetchOrganizations(lastId)
      .then((orgs) => {
        setState({
          _tag: "Done",
          orgs: orgs,
          nextPage: () => {
            fetchSince(
              [0, ...orgs.map((o) => o.id)].reduce((x, y) => Math.max(x, y))
            );
          },
        });
      })
      .catch(() => {
        setState({
          _tag: "Errored",
          reason: "Unexpected Error",
          retry: () => {
            fetchSince(lastId);
          },
        });
      });
  };

  return state;
}

export interface UseOrganisationsContext {
  readonly useOrganisation: () => OrganizationsState;
}

export const useOrganisationsContext = React.createContext<
  UseOrganisationsContext
>({ useOrganisation });

export const Organizations = () => {
  const { useOrganisation } = React.useContext(useOrganisationsContext);
  const state = useOrganisation();

  switch (state._tag) {
    case "Loading": {
      return <Loading />;
    }
    case "Errored": {
      return (
        <>
          <ErrorMessage error={state.reason} />{" "}
          <div style={{ marginTop: "1em" }}>
            <button onClick={state.retry}>Retry</button>
          </div>
        </>
      );
    }
    case "Done": {
      return (
        <>
          <div style={{ marginBottom: "1em" }}>Organizations:</div>
          {state.orgs.map((o) => o.login).join(", ")}
          <div style={{ marginTop: "1em" }}>
            <button onClick={state.nextPage}>Next</button>
          </div>
        </>
      );
    }
  }
};
