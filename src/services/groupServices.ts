import { GroupFreeValues, GroupPaidValues } from "../utils/schema/group";
import * as groupRepositories from "../repositories/groupRepositories";
import fs from "node:fs";
import path from "node:path";
import prisma from "../utils/prisma";

export const getDiscoverGroups = async (name?: string) => {
  return await groupRepositories.getDiscoverGroups(name);
};

export const getDiscoverePeople = async (name?: string, userId?: string) => {
  return await groupRepositories.getDiscoverePeople(name, userId);
};

export const upsertFreeGroup = async (
  data: GroupFreeValues,
  userId: string,
  photo?: string,
  groupId?: string
) => {
  if (groupId && photo) {
    const group = await groupRepositories.groupFindById(groupId);

    const pathPhoto = path.join(
      __dirname,
      "../../public/assets/uploads/groups",
      group.photo
    );
    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto);
    }
  }

  const group = await groupRepositories.upsertFreeGroup(
    data,
    userId,
    photo,
    groupId
  );

  return group;
};

export const upsertPaidGroup = async (
  data: GroupPaidValues,
  userId: string,
  photo?: string,
  assets?: string[],
  groupId?: string
) => {
  if (groupId && photo) {
    const group = await groupRepositories.groupFindById(groupId);

    const pathPhoto = path.join(
      __dirname,
      "../../public/assets/uploads/groups",
      group.photo
    );
    if (fs.existsSync(pathPhoto)) {
      fs.unlinkSync(pathPhoto);
    }
  }
  const group = await groupRepositories.upsertPaidGroup(
    data,
    userId,
    photo,
    assets,
    groupId
  );

  return group;
};

export const findDetailGroup = async (id: string, userId: string) => {
  return await groupRepositories.findDetailGroup(id, userId);
};

export const getMyOwngroup = async (userId: string) => {
  const groups = await groupRepositories.getMyOwngroup(userId);

  const paidGroups = groups.filter((item) => {
    return item.type === "PAID";
  }).length;

  const freeGroups = groups.filter((item) => {
    return item.type === "FREE";
  }).length;

  const TotalMembers = await groupRepositories.getTotalMembers(
    groups.map((item) => item.room.id)
  );

  return {
    list: groups.map((item) => {
      return {
        id: item.id,
        photo_url: item.photo_url,
        name: item.name,
        type: item.type,
        total_members: item.room._count.members,
      };
    }),
    paid_groups: paidGroups,
    free_groups: freeGroups,
    Total_embers: TotalMembers,
  };
};

export const addMemberFreeGroups = async (groupId: string, userId: string) => {
  const checkmember = await groupRepositories.getMemberbyId(userId, groupId);

  if (checkmember) {
    throw new Error("you already joined grup");
  }

  const group = await groupRepositories.groupFindById(groupId);

  if (group.type === "PAID") {
    throw new Error("this group VIP/Paid");
  }

  await groupRepositories.addMemberToGroup(group.room_id, userId);

  return true;
};

export const deleteAssetGroup = async (assetId: string) => {
  const asset = await groupRepositories.findAssetGroup(assetId);
  // if (
  //   fs.existsSync(
  //     path.join(
  //       __dirname,
  //       "../../public/assets/uploads/groups_assets/",
  //       asset.filename
  //     )
  //   )
  // ) {
  //   fs.unlinkSync(
  //     path.join(
  //       __dirname,
  //       "../../public/assets/uploads/groups_assets/",
  //       asset.filename
  //     )
  //   );
  // }

  const filePath = path.join(
    __dirname,
    "../../public/assets/uploads/groups_assets/", // Correct path
    asset.filename
  );

  if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
  }



  return await groupRepositories.deleteAssetGroup(asset.id);
};
