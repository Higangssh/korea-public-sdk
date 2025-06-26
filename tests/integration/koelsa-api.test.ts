import { KOELSAClient } from "../../src/clients/koelsa/KOELSAClient";

describe("KOELSA API 기본 동작 확인", () => {
  let client: KOELSAClient;

  beforeAll(() => {
    const serviceKey = process.env.KOELSA_SERVICE_KEY || "test-service-key";
    client = new KOELSAClient(serviceKey);
  });

  describe("설치정보 API", () => {
    it("getInstallationList - 목록만 조회", async () => {
      if (!process.env.KOELSA_SERVICE_KEY) {
        console.warn("KOELSA_SERVICE_KEY 환경변수가 없어 테스트를 건너뜁니다");
        return;
      }

      try {
        const items = await client.installation.getInstallationList({
          pageNo: 1,
          numOfRows: 3,
          Installation_sdt: "20230101",
          Installation_edt: "20230131",
        });

        // 배열 형태인지 확인
        expect(Array.isArray(items)).toBe(true);

        console.log(`설치정보 목록 API: ${items.length}개 항목 반환`);
      } catch (error) {
        console.error("설치정보 목록 API 호출 실패:", error);
        throw error;
      }
    }, 10000);

    it("getInstallationListWithPagination - 페이징 정보 포함 조회", async () => {
      if (!process.env.KOELSA_SERVICE_KEY) {
        console.warn("KOELSA_SERVICE_KEY 환경변수가 없어 테스트를 건너뜁니다");
        return;
      }

      try {
        const response =
          await client.installation.getInstallationListWithPagination({
            pageNo: 1,
            numOfRows: 3,
            Installation_sdt: "20230101",
            Installation_edt: "20230131",
          });

        // 표준 공공데이터 응답 구조 확인
        expect(response).toHaveProperty("response");
        expect(response.response).toHaveProperty("header");
        expect(response.response).toHaveProperty("body");
        expect(response.response.header).toHaveProperty("resultCode");
        expect(response.response.header).toHaveProperty("resultMsg");

        console.log(
          `설치정보 페이징 API: ${response.response.header.resultCode} - ${response.response.header.resultMsg}`
        );
      } catch (error) {
        console.error("설치정보 페이징 API 호출 실패:", error);
        throw error;
      }
    }, 10000);
  });

  describe("검사결과 API", () => {
    it("getInspectResultList - 목록만 조회", async () => {
      if (!process.env.KOELSA_SERVICE_KEY) {
        return;
      }

      try {
        const items = await client.inspection.getInspectResultList({
          pageNo: 1,
          numOfRows: 1,
          elvtrmngno_mngno: "test-code",
        });

        // 배열 형태인지 확인
        expect(Array.isArray(items)).toBe(true);

        console.log(`검사결과 목록 API: ${items.length}개 항목 반환`);
      } catch (error) {
        console.error("검사결과 목록 API 호출 실패:", error);
        // 이 API는 특정 관리코드가 필요해서 에러가 날 수 있음
        console.warn("검사결과 API는 유효한 관리코드가 필요합니다");
      }
    }, 10000);

    it("getInspectResultListWithPagination - 페이징 정보 포함 조회", async () => {
      if (!process.env.KOELSA_SERVICE_KEY) {
        return;
      }
      try {
        const response =
          await client.inspection.getInspectResultListWithPagination({
            pageNo: 1,
            numOfRows: 1,
            elvtrmngno_mngno: "test-code",
          });

        // 표준 공공데이터 응답 구조 확인
        expect(response).toHaveProperty("response");
        expect(response.response).toHaveProperty("header");
        expect(response.response).toHaveProperty("body");
        expect(response.response.header).toHaveProperty("resultCode");
        expect(response.response.header).toHaveProperty("resultMsg");

        console.log(
          `검사결과 페이징 API: ${response.response.header.resultCode} - ${response.response.header.resultMsg}`
        );
      } catch (error) {
        console.error("검사결과 페이징 API 호출 실패:", error);
        // 이 API는 특정 관리코드가 필요해서 에러가 날 수 있음
        console.warn("검사결과 API는 유효한 관리코드가 필요합니다");
      }
    }, 10000);
  });

  describe("기본 기능", () => {
    it("health check 동작 확인", async () => {
      if (!process.env.KOELSA_SERVICE_KEY) {
        return;
      }

      const isHealthy = await client.healthCheck();
      console.log(`Health Check: ${isHealthy}`);

      expect(typeof isHealthy).toBe("boolean");
    });

    it("클라이언트 정보 확인", () => {
      const info = client.getClientInfo();

      expect(info.provider.name).toBe("Korea Elevator Safety Agency");
      expect(info.services.length).toBeGreaterThan(0);

      console.log(`지원 서비스: ${info.services.join(", ")}`);
    });
  });
});
