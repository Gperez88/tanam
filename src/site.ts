import * as admin from 'firebase-admin';

export interface SiteInfo {
  name: string;
  domain: string;
  // TODO: More info
}

export abstract class SiteFirebasePath {
  static readonly themeName = 'site/settings/theme';
  static readonly domain = 'site/settings/domain';
}

export async function getThemeName(): Promise<string> {
  return (await admin.database().ref(SiteFirebasePath.themeName).once('value')).val() || 'default';
}

export async function getDomain(): Promise<string> {
  return (await admin.database().ref(SiteFirebasePath.domain).once('value')).val() || `${process.env.GCLOUD_PROJECT}.firebaseapp.com`;
}

export async function getDomains(): Promise<string[]> {
  const domains = [`${process.env.GCLOUD_PROJECT}.firebaseapp.com`];
  const domainSnap = await admin.database().ref(SiteFirebasePath.domain).once('value');
  if (domainSnap.exists()) {
    domains.push(domainSnap.val());
  }
  return domains;
}

export async function getSiteInfo() {
  const defaultData: SiteInfo = {
    name: process.env.GCLOUD_PROJECT,
    domain: await getDomain()
  };

  const siteInfoData = (await admin.database().ref('site/info').once('value')).val() || {};
  return { ...defaultData, ...siteInfoData } as SiteInfo;
}
