interface IVacancy {
  name: string;
  alternate_url?: string;
  employer: {
    name: string;
  };
  salary: {
    from: number;
    to: number;
    currency: string;
  } | null;
}
export interface IVacanciesResponse {
  items: IVacancy[];
}
