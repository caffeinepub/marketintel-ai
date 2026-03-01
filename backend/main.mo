import Map "mo:core/Map";
import List "mo:core/List";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type AnalysisRecord = {
    assetSymbol : Text;
    timeframe : Text;
    trend : Text;
    rsiStatus : Text;
    supportLevels : [Float];
    resistanceLevels : [Float];
    riskLevel : Text;
    summary : Text;
    timestamp : Time.Time;
  };

  module AnalysisRecord {
    public func compareByTimestamp(newRecord : AnalysisRecord, oldRecord : AnalysisRecord) : Order.Order {
      if (newRecord.timestamp > oldRecord.timestamp) { #less } else { #greater };
    };
  };

  let analyses = Map.empty<Principal, List.List<AnalysisRecord>>();

  public query ({ caller }) func getAnalysisHistory() : async [AnalysisRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access analysis history");
    };

    switch (analyses.get(caller)) {
      case (null) { [] };
      case (?history) { history.toArray().sort(AnalysisRecord.compareByTimestamp) };
    };
  };

  public shared ({ caller }) func saveAnalysis(record : AnalysisRecord) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save records");
    };

    let userHistory = switch (analyses.get(caller)) {
      case (null) { List.empty<AnalysisRecord>() };
      case (?existingHistory) { existingHistory };
    };

    userHistory.add(record);
    analyses.add(caller, userHistory);
  };
};
