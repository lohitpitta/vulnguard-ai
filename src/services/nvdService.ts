import { NVDCVEApiResponse, CVEDetail } from '../types';

const NVD_API_BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

export const nvdService = {
  async fetchCVE(cveId: string): Promise<CVEDetail> {
    const apiKey = import.meta.env.VITE_NVD_API_KEY;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['apiKey'] = apiKey;
    }

    try {
      const url = `${NVD_API_BASE_URL}?cveId=${encodeURIComponent(cveId)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `NVD API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      const data: NVDCVEApiResponse = await response.json();

      if (!data.vulnerabilities || data.vulnerabilities.length === 0) {
        throw new Error(`CVE ${cveId} not found in NVD database`);
      }

      return data.vulnerabilities[0].cve;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch CVE from NVD: ${error.message}`);
      }
      throw new Error('Failed to fetch CVE from NVD: Unknown error');
    }
  },

  async searchCVEs(params: {
    keyword?: string;
    cpeName?: string;
    cvssV3Severity?: string;
    isExact?: boolean;
  }): Promise<NVDCVEApiResponse> {
    const apiKey = import.meta.env.VITE_NVD_API_KEY;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['apiKey'] = apiKey;
    }

    try {
      const searchParams = new URLSearchParams();
      
      if (params.keyword) {
        searchParams.append('keywordSearch', params.keyword);
        if (params.isExact !== undefined) {
          searchParams.append('keywordExactMatch', params.isExact.toString());
        }
      }
      
      if (params.cpeName) {
        searchParams.append('cpeName', params.cpeName);
      }
      
      if (params.cvssV3Severity) {
        searchParams.append('cvssV3Severity', params.cvssV3Severity);
      }

      const url = `${NVD_API_BASE_URL}?${searchParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `NVD API error: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search CVEs in NVD: ${error.message}`);
      }
      throw new Error('Failed to search CVEs in NVD: Unknown error');
    }
  },

  extractCVEIdFromQuery(query: string): string | null {
    const cvePattern = /CVE-\d{4}-\d{4,}/i;
    const match = query.match(cvePattern);
    return match ? match[0].toUpperCase() : null;
  },
};
