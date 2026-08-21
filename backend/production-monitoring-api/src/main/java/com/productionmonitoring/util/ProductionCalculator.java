package com.productionmonitoring.util;

import com.productionmonitoring.entity.Production;
import com.productionmonitoring.entity.QtyDefect;

public class ProductionCalculator {

    public static int hitungTotalNg(Production p) {
        if (p.getDefects() == null) return 0;
        return p.getDefects().stream()
                .mapToInt(d -> d.getQtyNg() != null ? d.getQtyNg() : 0)
                .sum();
    }

    public static int hitungOutput(Production p) {
        int ok  = p.getQtyOk()  != null ? p.getQtyOk()  : 0;
        int wip = p.getQtyWip() != null ? p.getQtyWip() : 0;
        int ng  = hitungTotalNg(p);
        return ok + wip + ng;
    }

    public static int hitungTarget(Production p) {
        if (p.getMachine() == null || p.getProduct() == null) return 0;

        boolean isWip = p.getMachine().getName().equalsIgnoreCase("WIP");

        int uptime = p.getUptimeMc() != null ? p.getUptimeMc() : 0;
        int cavity = p.getProduct().getCavity() != null ? p.getProduct().getCavity() : 0;

        if (isWip) {
            int takeTime = p.getProduct().getTakeTime() != null ? p.getProduct().getTakeTime() : 0;
            if (takeTime == 0) return 0;
            return (int) Math.ceil((double) 3600 / takeTime * (uptime / 60.0));
        } else {
            int cycleTime = p.getProduct().getCycleTime() != null ? p.getProduct().getCycleTime() : 0;
            if (cycleTime == 0) return 0;
            return (int) Math.ceil((double) 3600 / cycleTime * cavity * (uptime / 60.0));
        }
    }

    public static int hitungAchieve(int output, int target) {
        if (target == 0) return 0;
        return (int) Math.floor((double) output / target * 100);
    }

    public static String hitungStatus(int output, int target) {
        if (target == 0) return "Tidak Target";
        return output >= target ? "Tercapai" : "Tidak Target";
    }

    public static String formatUptime(Integer menitTotal) {
        if (menitTotal == null || menitTotal == 0) return "0 menit";
        int jam = menitTotal / 60;
        int menit = menitTotal % 60;
        if (jam == 0) return menit + " menit";
        if (menit == 0) return jam + " jam";
        return jam + " jam " + menit + " menit";
    }

    public static int hitungNgRate(Production p) {
        int totalNg = hitungTotalNg(p);
        int totalOutput = hitungOutput(p);
        if (totalOutput == 0) return 0;
        return (int) Math.floor((double) totalNg / totalOutput * 100);
    }
}