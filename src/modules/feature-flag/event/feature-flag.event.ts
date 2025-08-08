export class FeatureFlagEvent {
  constructor(
    public tenant: string,
    public feature: string,
    public environment: string,
  ) {}
}
