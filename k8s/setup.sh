#!/bin/bash
# helm install mysql --set auth.rootPassword=cs122b-root,auth.database=moviedb,auth.username=admin,auth.password=cs122b,secondary.persistence.enabled=true,secondary.persistence.size=2Gi,primary.persistence.enabled=true,primary.persistence.size=2Gi,architecture=replication,auth.replicationPassword=cs122b-replica,secondary.replicaCount=1,primary.resourcesPreset=medium,secondary.resourcesPreset=medium oci://registry-1.docker.io/bitnamicharts/mysql





export KOPS_STATE_STORE=s3://fabflix-k8-state-store
kops export kubecfg --admin

