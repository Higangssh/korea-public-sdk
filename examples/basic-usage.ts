import { createKOELSAClient, KOELSAClient } from "../src/index";

/**
 * 기본 사용 예제
 */
async function basicUsageExample() {
  // 환경변수에서 서비스키 가져오기
  const serviceKey = process.env.KOELSA_SERVICE_KEY;

  if (!serviceKey) {
    console.error("KOELSA_SERVICE_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  try {
    // 1. 클라이언트 생성
    const koelsa = createKOELSAClient(serviceKey);

    console.log("=== 한국승강기안전공단 API 클라이언트 정보 ===");
    const clientInfo = koelsa.getClientInfo();
    console.log("제공기관:", clientInfo.provider.name);
    console.log("지원 서비스:", clientInfo.services);

    // 2. 서비스 상태 확인
    console.log("\n=== 서비스 상태 확인 ===");
    const isHealthy = await koelsa.healthCheck();
    console.log("서비스 상태:", isHealthy ? "정상" : "오류");

    if (!isHealthy) {
      console.log("서비스가 정상적이지 않습니다. 서비스키를 확인해주세요.");
      return;
    }

    // 3. 승강기 설치정보 조회
    console.log("\n=== 승강기 설치정보 조회 ===");
    const installationList = await koelsa.installation.getInstallationList({
      pageNo: 1,
      numOfRows: 5,
      Installation_sdt: "20240101",
      Installation_edt: "20240131",
    });

    console.log(`조회된 승강기 수: ${installationList.length}`);

    if (installationList.length > 0) {
      const firstElevator = installationList[0];
      console.log("\n첫 번째 승강기 정보:");
      console.log(`- 승강기 번호: ${firstElevator.elevatorNo}`);
      console.log(`- 건물명: ${firstElevator.buldNm}`);
      console.log(
        `- 주소: ${firstElevator.address1} ${firstElevator.address2}`
      );
      console.log(`- 제조업체: ${firstElevator.companyNm}`);
      console.log(`- 설치일자: ${firstElevator.installationDe}`);
    }

    // 4. 페이징 정보 포함 조회
    console.log("\n=== 페이징 정보 포함 조회 ===");
    const paginatedResult =
      await koelsa.installation.getInstallationListWithPagination({
        pageNo: 1,
        numOfRows: 3,
        Installation_sdt: "20240101",
        Installation_edt: "20240131",
      });

    console.log(`페이지 번호: ${paginatedResult.pageNo}`);
    console.log(`페이지당 결과 수: ${paginatedResult.numOfRows}`);
    console.log(`전체 결과 수: ${paginatedResult.totalCount}`);

    // 5. 특정 승강기 정보 조회 (첫 번째 승강기가 있는 경우)
    if (installationList.length > 0) {
      console.log("\n=== 특정 승강기 정보 재조회 ===");
      const elevatorNo = installationList[0].elevatorNo;
      const specificElevator =
        await koelsa.installation.getElevatorInstallationInfo(
          elevatorNo,
          "20240101",
          "20240131"
        );

      if (specificElevator) {
        console.log(`조회 성공: ${specificElevator.buldNm}`);
      } else {
        console.log("해당 승강기 정보를 찾을 수 없습니다.");
      }
    }
  } catch (error) {
    console.error("오류 발생:", error instanceof Error ? error.message : error);
  }
}

/**
 * 고급 사용 예제
 */
async function advancedUsageExample() {
  const serviceKey = process.env.KOELSA_SERVICE_KEY;

  if (!serviceKey) {
    console.error("KOELSA_SERVICE_KEY 환경변수가 설정되지 않았습니다.");
    return;
  }

  try {
    // 커스텀 설정으로 클라이언트 생성
    const koelsa = new KOELSAClient(serviceKey, {
      timeout: 60000,
      headers: {
        "User-Agent": "KoreaPublicSDK-Example/1.0.0",
      },
    });

    console.log("\n=== 고급 사용 예제 ===");

    // 서비스키 동적 업데이트 예제
    console.log("서비스키 업데이트 테스트...");
    koelsa.updateServiceKey(serviceKey); // 같은 키로 업데이트 (테스트용)
    console.log("서비스키 업데이트 완료");

    // 검사신청결과 조회 예제 (실제 관리코드가 필요)
    console.log("\n=== 검사신청결과 조회 예제 ===");
    console.log("실제 관리코드가 필요하므로 스킵됩니다.");

    // 실제 사용 시:
    // const inspectResults = await koelsa.inspectResult.getInspectResultByCode(
    //   '실제관리코드',
    //   'json'
    // );
  } catch (error) {
    console.error(
      "고급 예제 오류:",
      error instanceof Error ? error.message : error
    );
  }
}

// 예제 실행
async function runExamples() {
  await basicUsageExample();
  await advancedUsageExample();
}

// 스크립트가 직접 실행된 경우에만 예제 실행
if (require.main === module) {
  runExamples().catch(console.error);
}

export { basicUsageExample, advancedUsageExample };
