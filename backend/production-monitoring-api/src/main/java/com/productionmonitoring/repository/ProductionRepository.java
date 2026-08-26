package com.productionmonitoring.repository;

import com.productionmonitoring.entity.Production;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Stream;

public interface ProductionRepository
        extends JpaRepository<Production, Long>,
        JpaSpecificationExecutor<Production> {

    // =====================================================================
    // AGREGASI SUMMARY — DIHITUNG OLEH DATABASE (VERSI A)
    //
    // ⚠️ PENTING — RUMUS TARGET DI BAWAH ADALAH CERMIN DARI:
    //    ProductionCalculator.hitungTarget()
    //    - WIP    : CEILING(3600 / take_time  * (uptime / 60))
    //    - Normal : CEILING(3600 / cycle_time * cavity * (uptime / 60))
    //    - take_time / cycle_time = 0 -> target 0
    //    - deteksi WIP berdasarkan NAMA mesin ('wip'), bukan id
    //
    //    Kalau rumus di ProductionCalculator BERUBAH,
    //    SEMUA query di file ini yang mengandung CEILING(...) WAJIB ikut diubah.
    // =====================================================================

    /**
     * Total agregat semua produksi dalam rentang tanggal untuk kartu
     * summary operator. Satu produksi dihitung SEKALI jika salah satu
     * operatornya cocok dengan filter grup.
     *
     * Kolom hasil: [0] total_output, [1] total_target
     */
    @Query(value = """
        SELECT
            COALESCE(SUM(
                COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)
            ), 0)                                                                      AS total_output,
            COALESCE(SUM(
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0
                               THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0
                               THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            ), 0)::bigint                                                              AS total_target
        FROM production_raw_reports p
        INNER JOIN products pr ON pr.id = p.product_id
        INNER JOIN machines m  ON m.id  = p.machine_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        LEFT JOIN operators o1 ON o1.id = p.operator1_id
        LEFT JOIN operators o2 ON o2.id = p.operator2_id
        LEFT JOIN operators o3 ON o3.id = p.operator3_id
        WHERE p.production_lot BETWEEN :mulai AND :selesai
          AND (
              CASE WHEN (CAST(:groub AS TEXT) IS NULL OR :groub = '')
                   THEN (
                        (o1.id IS NOT NULL AND COALESCE(LOWER(o1.groub), '') <> 'resign')
                     OR (o2.id IS NOT NULL AND COALESCE(LOWER(o2.groub), '') <> 'resign')
                     OR (o3.id IS NOT NULL AND COALESCE(LOWER(o3.groub), '') <> 'resign')
                   )
                   ELSE (
                        (o1.id IS NOT NULL AND COALESCE(LOWER(o1.groub), '') = LOWER(:groub))
                     OR (o2.id IS NOT NULL AND COALESCE(LOWER(o2.groub), '') = LOWER(:groub))
                     OR (o3.id IS NOT NULL AND COALESCE(LOWER(o3.groub), '') = LOWER(:groub))
                   )
              END
          )
        """, nativeQuery = true)
    List<Object[]> sumProductionForCards(
            @Param("mulai")   LocalDate mulai,
            @Param("selesai") LocalDate selesai,
            @Param("groub")   String groub
    );

    // ---------------------------------------------------------------------

    /**
     * Total agregat produksi SATU operator dalam rentang tanggal.
     *
     * Kolom hasil:
     * [0] total_ok, [1] total_wip, [2] total_output, [3] total_target,
     * [4] total_uptime, [5] total_logs, [6] total_logs_achieve
     */
    @Query(value = """
        SELECT
            COALESCE(SUM(COALESCE(p.qty_ok, 0)), 0)                                    AS total_ok,
            COALESCE(SUM(COALESCE(p.qty_wip, 0)), 0)                                   AS total_wip,
            COALESCE(SUM(
                COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)
            ), 0)                                                                      AS total_output,
            COALESCE(SUM(
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0
                               THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0
                               THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            ), 0)::bigint                                                              AS total_target,
            COALESCE(SUM(COALESCE(p.uptime_mc, 0)), 0)                                 AS total_uptime,
            COUNT(*)                                                                   AS total_logs,
            COUNT(*) FILTER (WHERE
                (COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0))
                >=
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0
                               THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0
                               THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            )                                                                          AS total_logs_achieve
        FROM production_raw_reports p
        INNER JOIN products pr ON pr.id = p.product_id
        INNER JOIN machines m  ON m.id  = p.machine_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        WHERE p.production_lot BETWEEN :mulai AND :selesai
          AND (p.operator1_id = :opId
               OR p.operator2_id = :opId
               OR p.operator3_id = :opId)
        """, nativeQuery = true)
    List<Object[]> sumProductionForOperator(
            @Param("opId")    Long opId,
            @Param("mulai")   LocalDate mulai,
            @Param("selesai") LocalDate selesai
    );

    // ---------------------------------------------------------------------

    @Query("""
        SELECT p FROM Production p
        WHERE (p.operator1.id = :opId OR p.operator2.id = :opId OR p.operator3.id = :opId)
        AND p.productionLot BETWEEN :mulai AND :selesai
    """)
    Page<Production> findByOperatorAndLotRange(
            @Param("opId")    Long opId,
            @Param("mulai")   LocalDate mulai,
            @Param("selesai") LocalDate selesai,
            Pageable pageable
    );

    // ---------------------------------------------------------------------

    /**
     * Total NG per production untuk sekumpulan id — dipakai membangun log
     * detail operator agar TIDAK lazy-load collection defects per baris (N+1).
     *
     * Kolom hasil: [0] production_id, [1] total_ng
     */
    @Query(value = """
        SELECT production_id, SUM(qty_ng)
        FROM qty_defects
        WHERE production_id IN (:ids)
        GROUP BY production_id
        """, nativeQuery = true)
    List<Object[]> sumNgPerProductionIds(@Param("ids") List<Long> ids);

    // =====================================================================
    // PRODUCT SUMMARY — QUERY BARU
    // =====================================================================

    /**
     * Agregat per produk — untuk list halaman utama Product Summary.
     *
     * Kolom hasil:
     * [0] product_id, [1] part_no, [2] part_name, [3] customer_name,
     * [4] total_ok,   [5] total_wip, [6] total_ng, [7] total_output,
     * [8] total_target, [9] total_logs, [10] total_uptime
     */
    @Query(value = """
        SELECT
            pr.id                                                                      AS product_id,
            pr.part_no                                                                 AS part_no,
            pr.part_name                                                               AS part_name,
            c.customer                                                                 AS customer_name,
            COALESCE(SUM(COALESCE(p.qty_ok,  0)), 0)                                  AS total_ok,
            COALESCE(SUM(COALESCE(p.qty_wip, 0)), 0)                                  AS total_wip,
            COALESCE(SUM(COALESCE(d.ng, 0)), 0)                                       AS total_ng,
            COALESCE(SUM(
                COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)
            ), 0)                                                                      AS total_output,
            COALESCE(SUM(
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            ), 0)::bigint                                                              AS total_target,
            COUNT(*)                                                                   AS total_logs,
            COALESCE(SUM(COALESCE(p.uptime_mc, 0)), 0)                                AS total_uptime
        FROM production_raw_reports p
        INNER JOIN products  pr ON pr.id = p.product_id
        INNER JOIN machines  m  ON m.id  = p.machine_id
        INNER JOIN customer c   ON c.id  = pr.customer_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        WHERE p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (:customerId IS NULL OR pr.customer_id = :customerId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
          AND (
              CAST(:keyword AS TEXT) IS NULL
              OR LOWER(pr.part_no)   LIKE LOWER(CONCAT('%', :keyword, '%'))
              OR LOWER(pr.part_name) LIKE LOWER(CONCAT('%', :keyword, '%'))
          )
        GROUP BY pr.id, pr.part_no, pr.part_name, c.customer
        """, nativeQuery = true)
    List<Object[]> sumProductionPerProduct(
            @Param("mulai")     LocalDate mulai,
            @Param("selesai")   LocalDate selesai,
            @Param("machineId") Long machineId,
            @Param("customerId") Long customerId,
            @Param("excludeWip") boolean excludeWip,
            @Param("keyword")   String keyword
    );

    // ---------------------------------------------------------------------

    /**
     * Agregat global semua produk — untuk cards halaman utama Product Summary.
     *
     * Kolom hasil: [0] total_output, [1] total_target, [2] total_ng, [3] total_uptime
     */
    @Query(value = """
        SELECT
            COALESCE(SUM(
                COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)
            ), 0)                                                                      AS total_output,
            COALESCE(SUM(
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            ), 0)::bigint                                                              AS total_target,
            COALESCE(SUM(COALESCE(d.ng, 0)), 0)                                       AS total_ng,
            COALESCE(SUM(COALESCE(p.uptime_mc, 0)), 0)                                AS total_uptime
        FROM production_raw_reports p
        INNER JOIN products pr ON pr.id = p.product_id
        INNER JOIN machines m  ON m.id  = p.machine_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        WHERE p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (:customerId IS NULL OR pr.customer_id = :customerId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
        """, nativeQuery = true)
    List<Object[]> sumProductionCardsGlobal(
            @Param("mulai")     LocalDate mulai,
            @Param("selesai")   LocalDate selesai,
            @Param("machineId") Long machineId,
            @Param("customerId") Long customerId,
            @Param("excludeWip") boolean excludeWip
    );

    // ---------------------------------------------------------------------

    /**
     * Distribusi NG per jenis defect — untuk chart halaman utama.
     *
     * Kolom hasil: [0] defect_name, [1] total_ng
     */
    @Query(value = """
        SELECT
            nd.name                      AS defect_name,
            COALESCE(SUM(qd.qty_ng), 0)  AS total_ng
        FROM qty_defects qd
        INNER JOIN ng_defects             nd ON nd.id = qd.ng_defect_id
        INNER JOIN production_raw_reports p  ON p.id  = qd.production_id
        INNER JOIN products               pr ON pr.id = p.product_id
        INNER JOIN machines               m  ON m.id  = p.machine_id
        WHERE p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (:customerId IS NULL OR pr.customer_id = :customerId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
        GROUP BY nd.name
        ORDER BY total_ng DESC
        """, nativeQuery = true)
    List<Object[]> sumNgPerDefectGlobal(
            @Param("mulai")     LocalDate mulai,
            @Param("selesai")   LocalDate selesai,
            @Param("machineId") Long machineId,
            @Param("customerId") Long customerId,
            @Param("excludeWip") boolean excludeWip
    );

    // ---------------------------------------------------------------------

    /**
     * Agregat detail satu produk — untuk cards halaman detail.
     *
     * Kolom hasil:
     * [0] total_ok, [1] total_wip,    [2] total_ng,          [3] total_output,
     * [4] total_target, [5] total_uptime, [6] total_logs, [7] total_logs_achieve
     */
    @Query(value = """
        SELECT
            COALESCE(SUM(COALESCE(p.qty_ok,  0)), 0)                                  AS total_ok,
            COALESCE(SUM(COALESCE(p.qty_wip, 0)), 0)                                  AS total_wip,
            COALESCE(SUM(COALESCE(d.ng, 0)), 0)                                       AS total_ng,
            COALESCE(SUM(
                COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)
            ), 0)                                                                      AS total_output,
            COALESCE(SUM(
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            ), 0)::bigint                                                              AS total_target,
            COALESCE(SUM(COALESCE(p.uptime_mc, 0)), 0)                                AS total_uptime,
            COUNT(*)                                                                   AS total_logs,
            COUNT(*) FILTER (WHERE
                (COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0))
                >=
                CASE WHEN LOWER(m.name) = 'wip'
                     THEN CASE WHEN COALESCE(pr.take_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.take_time
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                     ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0 THEN 0
                               ELSE CEILING(3600.0 / pr.cycle_time
                                        * COALESCE(pr.cavity, 0)
                                        * (COALESCE(p.uptime_mc, 0) / 60.0))
                          END
                END
            )                                                                          AS total_logs_achieve
        FROM production_raw_reports p
        INNER JOIN products pr ON pr.id = p.product_id
        INNER JOIN machines m  ON m.id  = p.machine_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        WHERE p.product_id = :productId
          AND p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
        """, nativeQuery = true)
    List<Object[]> sumProductionForProductDetail(
            @Param("productId")  Long productId,
            @Param("mulai")      LocalDate mulai,
            @Param("selesai")    LocalDate selesai,
            @Param("machineId")  Long machineId,
            @Param("excludeWip") boolean excludeWip
    );

    // ---------------------------------------------------------------------

    /**
     * Distribusi NG per jenis defect satu produk — untuk chart halaman detail.
     *
     * Kolom hasil: [0] defect_name, [1] total_ng
     */
    @Query(value = """
        SELECT
            nd.name                      AS defect_name,
            COALESCE(SUM(qd.qty_ng), 0)  AS total_ng
        FROM qty_defects qd
        INNER JOIN ng_defects             nd ON nd.id = qd.ng_defect_id
        INNER JOIN production_raw_reports p  ON p.id  = qd.production_id
        INNER JOIN machines               m  ON m.id  = p.machine_id
        WHERE p.product_id = :productId
          AND p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
        GROUP BY nd.name
        ORDER BY total_ng DESC
        """, nativeQuery = true)
    List<Object[]> sumNgPerDefectForProduct(
            @Param("productId")  Long productId,
            @Param("mulai")      LocalDate mulai,
            @Param("selesai")    LocalDate selesai,
            @Param("machineId")  Long machineId,
            @Param("excludeWip") boolean excludeWip
    );

    // ---------------------------------------------------------------------

    /**
     * Logs detail per produk — untuk list pageable halaman detail.
     *
     * Kolom hasil:
     * [0] production_id, [1] production_lot, [2] machine_name, [3] shift,
     * [4] operator1_name, [5] operator2_name, [6] operator3_name,
     * [7] qty_ok, [8] qty_wip, [9] total_ng, [10] total_output,
     * [11] target, [12] uptime_mc
     *
     * ⚠️ JANGAN mengirim Sort lewat Pageable — native query ini sudah punya
     * ORDER BY sendiri, dan Spring Data menolak dynamic sorting untuk
     * native query.
     */
    @Query(value = """
        SELECT
            p.id                                                                       AS production_id,
            p.production_lot                                                           AS production_lot,
            m.name                                                                     AS machine_name,
            p.shift                                                                    AS shift,
            o1.name                                                                    AS operator1_name,
            o2.name                                                                    AS operator2_name,
            o3.name                                                                    AS operator3_name,
            COALESCE(p.qty_ok,  0)                                                     AS qty_ok,
            COALESCE(p.qty_wip, 0)                                                     AS qty_wip,
            COALESCE(d.ng, 0)                                                          AS total_ng,
            COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)       AS total_output,
            CASE WHEN LOWER(m.name) = 'wip'
                 THEN CASE WHEN COALESCE(pr.take_time, 0) = 0 THEN 0
                           ELSE CEILING(3600.0 / pr.take_time
                                    * (COALESCE(p.uptime_mc, 0) / 60.0))
                      END
                 ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0 THEN 0
                           ELSE CEILING(3600.0 / pr.cycle_time
                                    * COALESCE(pr.cavity, 0)
                                    * (COALESCE(p.uptime_mc, 0) / 60.0))
                      END
            END                                                                        AS target,
            COALESCE(p.uptime_mc, 0)                                                   AS uptime_mc
        FROM production_raw_reports p
        INNER JOIN products  pr ON pr.id = p.product_id
        INNER JOIN machines  m  ON m.id  = p.machine_id
        LEFT JOIN operators  o1 ON o1.id = p.operator1_id
        LEFT JOIN operators  o2 ON o2.id = p.operator2_id
        LEFT JOIN operators  o3 ON o3.id = p.operator3_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        WHERE p.product_id = :productId
          AND p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
        ORDER BY p.production_lot DESC
        """,
            countQuery = """
        SELECT COUNT(*)
        FROM production_raw_reports p
        INNER JOIN machines m ON m.id = p.machine_id
        WHERE p.product_id = :productId
          AND p.production_lot BETWEEN :mulai AND :selesai
          AND (:machineId IS NULL OR p.machine_id = :machineId)
          AND (NOT :excludeWip OR LOWER(m.name) <> 'wip')
        """,
            nativeQuery = true)
    Page<Object[]> findLogsForProductDetail(
            @Param("productId")  Long productId,
            @Param("mulai")      LocalDate mulai,
            @Param("selesai")    LocalDate selesai,
            @Param("machineId")  Long machineId,
            @Param("excludeWip") boolean excludeWip,
            Pageable pageable
    );

    // =====================================================================
    // EXPORT EXCEL — QUERY PROYEKSI (FILTER + KALKULASI DI DATABASE)
    //
    // ⚠️ PENTING — RUMUS TARGET DI BAWAH ADALAH CERMIN DARI:
    //    ProductionCalculator.hitungTarget() (lihat catatan peringatan
    //    di atas — kalau rumus berubah, query ini WAJIB ikut diubah).
    //
    // Query ini memilih HANYA kolom yang dibutuhkan Excel (bukan entity
    // penuh + relasi), supaya memori Java tidak membengkak saat filter
    // menghasilkan ratusan ribu baris. Achieve %, NG Rate %, dan Status
    // dihitung di Java lewat ProductionCalculator (overload agregat),
    // BUKAN diduplikasi di SQL.
    // =====================================================================

    /**
     * Baris data untuk export Excel — hasilnya dikonsumsi langsung oleh
     * ProductionExcelExporter.
     *
     * Kolom hasil (urutan WAJIB sama dengan konsumsi di ProductionExcelExporter):
     * [0]  customer_name,  [1] part_no,       [2] part_name,     [3] machine_name,
     * [4]  shift,          [5] uptime_mc,     [6] operator1_name,
     * [7]  operator2_name, [8] operator3_name, [9] qty_ok,       [10] qty_wip,
     * [11] target,         [12] total_ng,     [13] total_output,
     * [14] production_lot, [15] remark
     */
    @QueryHints(@QueryHint(name = "org.hibernate.fetchSize", value = "1000"))
    @Query(value = """
        SELECT
            c.customer                                                                 AS customer_name,
            pr.part_no                                                                 AS part_no,
            pr.part_name                                                               AS part_name,
            m.name                                                                     AS machine_name,
            p.shift                                                                    AS shift,
            COALESCE(p.uptime_mc, 0)                                                   AS uptime_mc,
            o1.name                                                                    AS operator1_name,
            o2.name                                                                    AS operator2_name,
            o3.name                                                                    AS operator3_name,
            COALESCE(p.qty_ok,  0)                                                     AS qty_ok,
            COALESCE(p.qty_wip, 0)                                                     AS qty_wip,
            CASE WHEN LOWER(m.name) = 'wip'
                 THEN CASE WHEN COALESCE(pr.take_time, 0) = 0 THEN 0
                           ELSE CEILING(3600.0 / pr.take_time
                                    * (COALESCE(p.uptime_mc, 0) / 60.0))
                      END
                 ELSE CASE WHEN COALESCE(pr.cycle_time, 0) = 0 THEN 0
                           ELSE CEILING(3600.0 / pr.cycle_time
                                    * COALESCE(pr.cavity, 0)
                                    * (COALESCE(p.uptime_mc, 0) / 60.0))
                      END
            END                                                                        AS target,
            COALESCE(d.ng, 0)                                                          AS total_ng,
            COALESCE(p.qty_ok, 0) + COALESCE(p.qty_wip, 0) + COALESCE(d.ng, 0)       AS total_output,
            p.production_lot                                                           AS production_lot,
            p.remark                                                                   AS remark
        FROM production_raw_reports p
        INNER JOIN products  pr ON pr.id = p.product_id
        INNER JOIN machines  m  ON m.id  = p.machine_id
        INNER JOIN customer  c  ON c.id  = pr.customer_id
        LEFT JOIN operators  o1 ON o1.id = p.operator1_id
        LEFT JOIN operators  o2 ON o2.id = p.operator2_id
        LEFT JOIN operators  o3 ON o3.id = p.operator3_id
        LEFT JOIN (
            SELECT production_id, SUM(qty_ng) AS ng
            FROM qty_defects
            GROUP BY production_id
        ) d ON d.production_id = p.id
        WHERE (CAST(:keyword AS TEXT) IS NULL
               OR LOWER(pr.part_no)   LIKE LOWER(CONCAT('%', :keyword, '%'))
               OR LOWER(pr.part_name) LIKE LOWER(CONCAT('%', :keyword, '%')))
          AND (CAST(:customerId AS BIGINT) IS NULL OR pr.customer_id = :customerId)
          AND (CAST(:machineId  AS BIGINT) IS NULL OR p.machine_id    = :machineId)
          AND (CAST(:operatorId AS BIGINT) IS NULL
               OR p.operator1_id = :operatorId
               OR p.operator2_id = :operatorId
               OR p.operator3_id = :operatorId)
          AND (CAST(:shift AS TEXT) IS NULL OR p.shift = :shift)
          AND (CAST(:mulai   AS DATE) IS NULL OR p.production_lot >= :mulai)
          AND (CAST(:selesai AS DATE) IS NULL OR p.production_lot <= :selesai)
        ORDER BY p.id
        """, nativeQuery = true)
    Stream<Object[]> findRowsForExport(
            @Param("keyword")    String keyword,
            @Param("customerId") Long customerId,
            @Param("machineId")  Long machineId,
            @Param("operatorId") Long operatorId,
            @Param("shift")      String shift,
            @Param("mulai")      LocalDate mulai,
            @Param("selesai")    LocalDate selesai
    );
}